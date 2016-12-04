window.BrickBreaker = (function() {
  var klass = function BrickBreaker(width, height, canvas) {
    this.width     = width
    this.height    = height
    this.setCanvas(canvas)
    // 60 fps = 1 frame / 60 seconds = 0.016666 seconds = 16 milliseconds
    this.frame_length = 16
    this.ball      = new Ball(10, { x: width / 2, y: 50 }, { x: 5, y: 0 });
    this.paddle    = new Paddle({ x: width / 2, y: 450 }, 60, 15, 2)
    this.play_area = new PlayArea(this.width, this.height)
  }

  klass.prototype.setCanvas = function(canvas) {
    this.canvas = canvas
    this.ctx    = canvas.getContext('2d')
    this.canvas.width  = this.width
    this.canvas.height = this.height
  }

  klass.prototype.run = function() {
    this.animateScreen()
  }

  klass.prototype.animateScreen = function() {
    this.last_draw = new Date()

    function render() {
      var now = new Date(),
          dt  = now - this.last_draw

      // Move the ball
      this.moveBall(dt * 0.001)
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

  klass.prototype.performCollisions = function(ball) {
    this.performBorderCollisions(ball, this.play_area)
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

