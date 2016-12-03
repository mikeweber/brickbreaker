window.BrickBreaker = (function() {
  var klass = function BrickBreaker(width, height, canvas) {
    this.width     = width
    this.height    = height
    this.setCanvas(canvas)
    // 60 fps = 1 frame / 60 seconds = 0.016666 seconds = 16 milliseconds
    this.frame_length = 16
    this.ball      = new Ball(10, { x: width / 2, y: 50 }, { x: 5, y: 0 });
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
        this.drawBorder()
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

  klass.prototype.performCollisions = function(moving_object) {
    this.performBorderCollisions(moving_object, this.play_area)
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

  klass.prototype.clearCanvas = function() {
    this.ctx.fillStyle = '#ACF'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  return klass
})()

window.Ball = (function() {
  var klass = function Ball(radius, position, velocity) {
    this.radius     = radius
    this.position   = position
    this.velocity   = velocity
  }

  klass.prototype.move = function(dt) {
    // To move the ball "down" the screen, increae the y position
    this.velocity.y += this.getGravity() * dt
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
  }

  klass.prototype.draw = function(context) {
    context.save()
    context.fillStyle = '#333'
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    context.closePath()
    context.fill()
    context.restore()
  }

  klass.prototype.getGravity = function() {
    return 9.8
  }

  klass.prototype.getTop = function() {
    return this.position.y - this.radius
  }

  klass.prototype.getBottom = function() {
    return this.position.y + this.radius
  }

  klass.prototype.getLeft = function() {
    return this.position.x - this.radius
  }

  klass.prototype.getRight = function() {
    return this.position.x + this.radius
  }

  klass.prototype.bounceUp = function(surface) {
    this.position.y = surface - this.radius
    this.bounceYAxis()
  }

  klass.prototype.bounceDown = function(surface) {
    this.position.y = surface + this.radius
    this.bounceYAxis()
  }

  klass.prototype.bounceLeft = function(surface) {
    this.position.x = surface - this.radius
    this.bounceXAxis()
  }

  klass.prototype.bounceRight = function(surface) {
    this.position.x = surface + this.radius
    this.bounceXAxis()
  }

  klass.prototype.bounceXAxis = function() {
    this.velocity.x *= -0.5
  }

  klass.prototype.bounceYAxis = function() {
    this.velocity.x *= 0.99
    this.velocity.y *= -0.9
  }

  return klass
})()

window.PlayArea = (function() {
  var klass = function PlayArea(width, height) {
    this.width        = width
    this.height       = height
    this.border_width = 5
  }

  klass.prototype.draw = function(context) {
    context.save()
    context.strokeStyle = '#533'
    context.lineWidth   = this.border_width
    // Start at the top left, then move clockwise around the rectangle,
    // and draw a line connecting each corner.
    context.beginPath()
    context.moveTo(this.getTop(), this.getLeft())
    context.lineTo(this.getTop(), this.getRight())
    context.lineTo(this.getBottom(), this.getRight())
    context.lineTo(this.getBottom(), this.getLeft())
    context.lineTo(this.getTop(), this.getLeft())
    context.closePath()
    context.stroke()
    context.restore()
  }

  klass.prototype.getCollisionTop = function() {
    return this.getTop() + this.border_width / 2
  }

  klass.prototype.getCollisionBottom = function() {
    return this.getBottom() - this.border_width / 2
  }

  klass.prototype.getCollisionLeft = function() {
    return this.getLeft() + this.border_width / 2
  }

  klass.prototype.getCollisionRight = function() {
    return this.getRight() - this.border_width / 2
  }

  klass.prototype.getTop = function() {
    return 0
  }

  klass.prototype.getBottom = function() {
    return this.height
  }

  klass.prototype.getLeft = function() {
    return 0
  }

  klass.prototype.getRight = function() {
    return this.width
  }

  return klass
})()
