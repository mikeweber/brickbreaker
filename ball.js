window.Ball = (function() {
  var klass = function Ball(radius, position, velocity) {
    this.radius     = radius
    this.radius_sq  = radius * radius
    this.position   = position
    this.velocity   = velocity
  }

  klass.prototype.move = function(dt) {
    // To move the ball "down" the screen, increae the y position
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

  klass.prototype.getVelocity = function() {
    return Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)
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
    this.velocity.x *= -1
  }

  klass.prototype.bounceYAxis = function() {
    this.velocity.y *= -1
  }

  return klass
})()


