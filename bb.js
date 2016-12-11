window.BrickBreaker = (function() {
  var klass = function BrickBreaker(width, height, canvas, key_listener) {
    this.width        = width
    this.height       = height
    this.setCanvas(canvas)
    this.ball         = new Ball(10, { x: width / 2, y: 200 }, { x: (4 * Math.random() - 2), y: 5 });
    this.paddle       = new Paddle({ x: width / 2, y: 450 }, 60, 15, 300)
    this.play_area    = new PlayArea(this.width, this.height)
    this.key_listener = key_listener
    // 60 fps to seconds per frame = 1 second / 60 frames = 0.016666 seconds / frame = 16 milliseconds / frame
    this.frame_length = 16
    this.setup()
    this.animateScreen()
  }

  klass.prototype.setup = function() {
    this.pause()
    this.lives  = 3
    this.bricks = []
    this.bricks.push(new Brick({ x: 40, y: 50 }, 60, 15))
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 4; j++) {
        this.bricks.push(new Brick({ x: 40 + i * 70, y: 50 + j * 20 }, 60, 15))
      }
    }
  }

  klass.prototype.setCanvas = function(canvas) {
    this.canvas        = canvas
    this.ctx           = canvas.getContext('2d')
    this.canvas.width  = this.width
    this.canvas.height = this.height
  }

  klass.prototype.togglePaused = function() {
    this.running ? this.pause() : this.unpause()
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
        // Move the ball
        this.moveBall(dt * 0.001)
        this.movePaddle(dt * 0.001)
        // Check to see if the ball has collided with anything,
        // and make it bounce if it has.

        this.performCollisions(this.ball)
        this.removeDeadBricks()
        this.endGame()
      }

      // Wait to draw until frame_length milliseconds have passed
      if (dt > this.frame_length) {
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
        this.drawMessages()
        // Remember the current timestamp, so we can
        // calculate the time between frames
        this.last_draw = now
      }

      requestAnimationFrame(render.bind(this))
    }
    requestAnimationFrame(render.bind(this))
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
      ball.bounceUp(container.getCollisionBottom())
    } else if (ball.getLeft() < container.getCollisionLeft()) {
      ball.bounceRight(container.getCollisionLeft())
    } else if (ball.getRight() > container.getCollisionRight()) {
      ball.bounceLeft(container.getCollisionRight())
    }
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

  klass.prototype.drawMessages = function() {
    if (this.primary_message) {
      this.ctx.textAlign = 'center'
      this.ctx.fillStyle = '#FFF'
      this.ctx.font = '50pt Monaco'
      this.ctx.fillText(this.primary_message, 250, 250)
    }

    if (this.secondary_message) {
      this.ctx.textAlign = 'center'
      this.ctx.fillStyle = '#FFF'
      this.ctx.font = '30pt Monaco'
      this.ctx.fillText(this.secondary_message, 250, 300)
    }
  }

  klass.prototype.clearCanvas = function() {
    this.ctx.fillStyle = '#ACF'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  return klass
})()

