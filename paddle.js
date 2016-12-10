window.Paddle = (function() {
  var klass = function Paddle(position, width, height, movement_rate) {
    Brick.call(this, position, width, height)
    this.movement_rate = movement_rate
  }

  klass.prototype = Object.create(Brick.prototype)
  klass.constructor = klass

  klass.prototype.moveRight = function(dt, right_surface) {
    var old_x = this.position.x
    this.position.x += this.movement_rate * dt
    if (this.getRight() > right_surface) {
      this.position.x = right_surface - this.width / 2
    }
  }

  klass.prototype.moveLeft = function(dt, left_surface) {
    this.position.x -= this.movement_rate * dt
    if (this.getLeft() < left_surface) {
      this.position.x = left_surface + this.width / 2
    }
  }

  return klass
})()
