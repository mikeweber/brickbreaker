window.BrickBreaker = (function() {
  var klass = function BrickBreaker(width, height, canvas, key_listener) {
    this.width        = width
    this.height       = height
    this.setCanvas(canvas)
    this.play_area    = new PlayArea(this.width, this.height)
    this.key_listener = key_listener
    // 60 fps to seconds per frame = 1 second / 60 frames = 0.016666 seconds / frame = 16 milliseconds / frame
    this.frame_length = 16
    this.setup()
    this.animateScreen()
  }

  klass.prototype.setup = function() {
    this.pause()
    this.reset()
    this.lives  = 3
    this.bricks = []
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 4; j++) {
        this.bricks.push(new Brick({ x: 40 + i * 70, y: 50 + j * 20 }, 60, 15))
      }
    }
  }

  klass.prototype.reset = function() {
    this.ball   = new Ball(10, { x: this.width / 2, y: 200 }, { x: (4 * Math.random() - 2), y: 5 });
    this.paddle = new Paddle({ x: this.width / 2, y: 450 }, 60, 15, 300)
  }

  klass.prototype.setCanvas = function(canvas) {
    this.canvas        = canvas
    this.ctx           = canvas.getContext('2d')
    this.canvas.width  = this.width
    this.canvas.height = this.height
  }

  klass.prototype.togglePaused = function() {
    if (this.frozen) {
      this.frozen = false
      this.reset()
    }
    this.running ? this.pause() : this.unpause()
  }

  klass.prototype.freeze = function() {
    this.running = false
    this.frozen  = true
  }

  klass.prototype.pause = function() {
    this.running           = false
    this.primary_message   = 'PAUSED'
    this.secondary_message = 'Press Space to start'
  }

  klass.prototype.unpause = function() {
    if (this.isGameOver()) return

    this.running           = true
    this.primary_message   = null
    this.secondary_message = null
  }

  klass.prototype.animateScreen = function() {
    this.last_draw = new Date()

    function render() {
      var now = new Date(),
          dt  = now - this.last_draw

      if (this.running) {
        this.movePaddle(dt * 0.001)
        this.performCollisions(this.ball)
        this.moveBall(dt * 0.001)
        this.removeDeadBricks()
        this.endGame()
      }

      if (dt > this.frame_length) {
        this.last_draw = now
        this.draw()
      }

      requestAnimationFrame(render.bind(this))
    }
    requestAnimationFrame(render.bind(this))
  }

  klass.prototype.draw = function(debug) {
    // Clear the canvas
    this.clearCanvas()
    // Draw the ball in it's new position
    this.drawBall()
    // Redraw the border. It hasn't moved, but it was removed
    // from the screen when `clearCanvas` was called
    this.drawBorder()
    // Draw the paddle
    this.drawPaddle()
    // Draw the bricks
    this.drawBricks()
    // Draw any messages
    this.drawMessages(this.ball)
  }

  klass.prototype.moveBall = function(dt) {
    this.ball.move(dt)
  }

  klass.prototype.movePaddle = function(dt) {
    if (this.key_listener.isActive('ArrowLeft')) {
      this.paddle.moveLeft(dt, this.play_area.getCollisionLeft())
    }
    if (this.key_listener.isActive('ArrowRight')) {
      this.paddle.moveRight(dt, this.play_area.getCollisionRight())
    }
  }

  klass.prototype.performCollisions = function(ball) {
    this.performBorderCollisions(ball, this.play_area)
    this.performBlockCollision(ball, this.paddle)
    for (var i = this.bricks.length; i--; ) {
      this.performBlockCollision(ball, this.bricks[i])
    }
  }

  klass.prototype.removeDeadBricks = function() {
    for (var i = this.bricks.length; i--; ) {
      if (!this.bricks[i].isAlive()) {
        this.bricks.splice(i, 1)
      }
    }
  }

  klass.prototype.endGame = function() {
    if (!this.isGameOver()) return

    if (this.isGameWon()) {
      this.primary_message = "You Win!"
    }
    if (this.isGameLost()) {
      this.primary_message = "Game Over"
      this.secondary_message = "you lose"
    }
    this.running = false
  }

  klass.prototype.isGameOver = function() {
    return this.isGameWon() || this.isGameLost()
  }

  klass.prototype.isGameWon = function() {
    return this.bricks.length == 0
  }

  klass.prototype.isGameLost = function() {
    return this.lives == 0
  }

  klass.prototype.performBorderCollisions = function(ball, container) {
    if (ball.getTop() < container.getCollisionTop()) {
      ball.bounceDown(container.getCollisionTop())
    } else if (ball.getBottom() > container.getCollisionBottom()) {
      this.loseLife()
    } else if (ball.getLeft() < container.getCollisionLeft()) {
      ball.bounceRight(container.getCollisionLeft())
    } else if (ball.getRight() > container.getCollisionRight()) {
      ball.bounceLeft(container.getCollisionRight())
    }
  }

  klass.prototype.loseLife = function() {
    this.lives--
    this.secondary_message = 'Press space'
    this.freeze()
  }

  klass.prototype.performBlockCollision = function(ball, block) {
    block.collide(ball)
  }

  klass.prototype.drawBall = function() {
    this.ball.draw(this.ctx)
  }

  klass.prototype.drawBorder = function() {
    this.play_area.draw(this.ctx)
  }

  klass.prototype.drawPaddle = function() {
    this.paddle.draw(this.ctx)
  }

  klass.prototype.drawBricks = function() {
    for (var i = this.bricks.length; i--; ) {
      this.bricks[i].draw(this.ctx)
    }
  }

  klass.prototype.drawMessages = function(ball) {
    this.showLives()
    this.showPrimaryMessage()
    this.showSecondaryMessage()
    this.showVelocity(ball)
  }

  klass.prototype.showLives = function() {
    this.ctx.textAlign = 'left'
    this.ctx.fillStyle = '#FFF'
    this.ctx.font = '10pt Monaco'
    this.ctx.fillText('Lives: ' + this.lives, 5, 25)
  }

  klass.prototype.showPrimaryMessage = function() {
    if (!this.primary_message) return

    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = '#FFF'
    this.ctx.font = '50pt Monaco'
    this.ctx.fillText(this.primary_message, 250, 250)
  }

  klass.prototype.showSecondaryMessage = function() {
    if (!this.secondary_message) return

    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = '#FFF'
    this.ctx.font = '30pt Monaco'
    this.ctx.fillText(this.secondary_message, 250, 300)
  }

  klass.prototype.showVelocity = function(ball) {
    this.ctx.textAlign = 'right'
    this.ctx.fillStyle = '#FFF'
    this.ctx.font = '10pt Monaco'
    this.ctx.fillText((ball.getVelocity()).toFixed(2) + ' (x: ' + ball.velocity.x.toFixed(2) + ', y: ' + ball.velocity.y.toFixed(2) + ')', 425, 25)
  }

  klass.prototype.clearCanvas = function() {
    this.ctx.fillStyle = '#ACF'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  return klass
})()

