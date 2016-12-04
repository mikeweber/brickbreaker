window.Paddle = (function() {
  var klass = function Paddle(position, width, height, movement_rate) {
    this.position      = position
    this.width         = width
    this.height        = height
    this.movement_rate = movement_rate
  }

  klass.prototype.moveRight = function(right_surface) {
    this.position += this.movement_rate
    if (this.getRight() > right_surface) {
    }
  }

  klass.prototype.moveLeft = function(left_surface) {
    this.position -= this.movement_rate
    if (this.getLeft() < left_surface) {
      this.position = left_surface + width
    }
  }

  klass.prototype.draw = function(context) {
    context.save()
    context.fillStyle = '#393'
    context.strokeStyle = '#171'
    // Start at the top left, then move clockwise around the rectangle,
    // and draw a line connecting each corner.
    context.beginPath()
    context.moveTo(this.getLeft(), this.getTop())
    context.lineTo(this.getRight(), this.getTop())
    context.lineTo(this.getRight(), this.getBottom())
    context.lineTo(this.getLeft(), this.getBottom())
    context.closePath()
    context.fill()
    context.stroke()
    context.restore()
  }

  klass.prototype.getLeft = function() {
    return this.position.x - this.width / 2
  }

  klass.prototype.getRight = function() {
    return this.position.x + this.width / 2
  }

  klass.prototype.getTop = function() {
    return this.position.y + this.height / 2
  }

  klass.prototype.getBottom = function() {
    return this.position.y - this.height / 2
  }

  return klass
})()
