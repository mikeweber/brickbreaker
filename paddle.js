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

  klass.prototype.collide = function(ball) {
    if (Brick.prototype.collide.call(this, ball)) {
      // Bounce the ball slightly left or right based on how far the ball hit from the center
      ball.velocity.x += (ball.position.x - this.position.x) / (this.width / 2) * 4
    }
  }

  return klass
})()
