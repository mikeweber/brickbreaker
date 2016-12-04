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

