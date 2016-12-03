window.BrickBreaker = (function() {
  var klass = function BrickBreaker(width, height, canvas) {
    this.width  = width
    this.height = height
    this.setCanvas(canvas)
    // 60 fps = 1 frame / 60 seconds = 0.016666 seconds = 16 milliseconds
    this.frame_length = 16
    this.ball   = new Ball(5, { x: width / 2, y: 50 }, { x: 0, y: 0 });
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

      // Wait to draw until frame_length milliseconds have passed
      if (dt > this.frame_length) {
        // Move the ball
        this.moveBall(dt * 0.001)
        // Clear the canvas
        this.clearCanvas()
        // Draw the ball in it's new position
        this.drawBall()
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

  klass.prototype.drawBall = function() {
    this.ball.draw(this.ctx)
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
    context.fillStyle = '#333'
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    context.fill()
  }

  klass.prototype.getGravity = function() {
    return 9.8
  }

  return klass
})()
