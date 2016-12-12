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

  klass.prototype.bounce = function(ball) {
    // Bounce the ball slightly left or right based on how far the ball hit from the center
    // From http://gamedev.stackexchange.com/questions/10911/a-ball-hits-the-corner-where-will-it-deflect
    var corner_x = this.position.x + (ball.position.x - this.position.x) * 0.95
    var corner_y = (ball.position.y < this.position.y) ? this.getTop() : this.getBottom()

    var x = ball.position.x - corner_x
    var y = ball.position.y - corner_y
    var c = -2 * (ball.velocity.x * x + ball.velocity.y * y) / (x * x + y * y)
    ball.velocity.x += c * x
    ball.velocity.y += c * y
    ball.move(0.1)
  }

  klass.prototype.getColor = function() {
    return '#393'
  }

  klass.prototype.isAlive = function() {
    return true
  }

  klass.prototype.hit = function() {}

  return klass
})()
