window.BrickBreaker = (function() {
  var klass = function BrickBreaker(width, height, canvas, key_listener) {
    this.width        = width
    this.height       = height
    this.setCanvas(canvas)
    this.ball         = new Ball(10, { x: width / 2, y: 50 }, { x: (4 * Math.random() - 2), y: 0 });
    this.paddle       = new Paddle({ x: width / 2, y: 450 }, 60, 15, 300)
    this.play_area    = new PlayArea(this.width, this.height)
    this.key_listener = key_listener
    // 60 fps to seconds per frame = 1 second / 60 frames = 0.016666 seconds / frame = 16 milliseconds / frame
    this.frame_length = 16
    this.animateScreen()
  }

  klass.prototype.setCanvas = function(canvas) {
    this.canvas = canvas
    this.ctx    = canvas.getContext('2d')
    this.canvas.width  = this.width
    this.canvas.height = this.height
  }

  klass.prototype.togglePaused = function() {
    this.running = !this.running
    this.run()
  }

  klass.prototype.run = function() {
    if (this.running) this.animateScreen()
  }

  klass.prototype.animateScreen = function() {
    this.last_draw = new Date()

    function render() {
      var now = new Date(),
          dt  = now - this.last_draw

      // Move the ball
      this.moveBall(dt * 0.001)
      this.movePaddle(dt * 0.001)
      // Check to see if the ball has collided with anything,
      // and make it bounce if it has.
      this.performCollisions(this.ball)

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
        // Remember the current timestamp, so we can
        // calculate the time between frames
        this.last_draw = now
      }

      if (this.running) requestAnimationFrame(render.bind(this))
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
    var ball_distance = { x: Math.abs(ball.position.x - block.position.x), y: Math.abs(ball.position.y - block.position.y) }
    // Too far away to possibly interact
    if (ball_distance.x > (block.width / 2 + ball.radius) || ball_distance.y > (block.height / 2 + ball.radius)) return false
    // Definitely interacting
    if (ball_distance.x <= block.width / 2 || ball_distance.y <= block.height / 2) {
      //if (ball.position.x >= block.getLeft() && block.getRight() >= ball.position.x) {
        ball.velocity.y *= -1
        ball.position.y = block.getTop() - block.height / 2
        ball.velocity.x += (ball.position.x - block.position.x) / (block.width / 2) * 4
      //}
      return true
    }

    // Might be interacting on a corner
    var corner_distance = (ball_distance.x - block.width / 2) * (ball_distance.x - block.width / 2) + (ball_distance.y - block.height / 2) * (ball_distance.y - block.height / 2)

    if (corner_distance <= ball.radius * ball.radius) {
      return true
    }
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

  klass.prototype.clearCanvas = function() {
    this.ctx.fillStyle = '#ACF'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  return klass
})()

