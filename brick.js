window.Brick = (function() {
  var klass = function Brick(position, width, height) {
    this.position      = position
    this.width         = width
    this.height        = height
    this.lives         = 3
  }

  klass.prototype.draw = function(context) {
    context.save()
    context.fillStyle   = this.getColor()
    context.strokeStyle = '#171'
    // Start at the top left, then move clockwise around the rectangle,
    // and draw a line connecting each corner.
    context.beginPath()
    context.moveTo(this.getLeft(),  this.getTop())
    context.lineTo(this.getRight(), this.getTop())
    context.lineTo(this.getRight(), this.getBottom())
    context.lineTo(this.getLeft(),  this.getBottom())
    context.closePath()
    context.fill()
    context.stroke()
    context.restore()
  }

  klass.prototype.getColor = function() {
    return ['#a51', '#c72', '#e93'][this.lives - 1]
  }

  klass.prototype.collide = function(ball) {
    if (this.hasCollided(ball)) {
      this.bounce(ball)
      this.hit()
      return true
    } else {
      return false
    }
  }

  // Axis-aligned bounding box detection
  klass.prototype.hasCollided = function(ball) {
    var ballTopLeft  = { x: ball.getLeft(), y: ball.getTop() }
    var brickTopLeft = { x: this.getLeft(), y: this.getTop() }

    if (
      ballTopLeft.x < brickTopLeft.x + this.width &&
        ballTopLeft.x + 2 * ball.radius > brickTopLeft.x &&
        ballTopLeft.y < brickTopLeft.y + this.width &&
        ballTopLeft.y + 2 * ball.radius > brickTopLeft.y
    ) {
      // Bounding boxes intersect. Now check if the
      // ball and brick are actually touching
      var ball_distance = {
        x: Math.abs(ball.position.x - this.position.x),
        y: Math.abs(ball.position.y - this.position.y)
      }
      if (ball_distance.x < (ball.radius + this.width / 2) && ball_distance.y < (ball.radius + this.height / 2)) {
        // Definitely interacting
        return true
      } else {
        // Might be interacting on a corner. This is the most
        // expensive check, so save it for last.
        var dist_x = (ball_distance.x - this.width / 2)
        var dist_y = (ball_distance.y - this.height / 2)
        var corner_distance_sq = dist_x * dist_x + dist_y * dist_y

        return corner_distance_sq <= ball.radius_sq
      }
    } else {
      return false
    }
  }

  klass.prototype.bounce = function(ball) {
    // From http://gamedev.stackexchange.com/questions/10911/a-ball-hits-the-corner-where-will-it-deflect
    var corner_x = this.getCollisionXCorner(ball.position.x)
    var corner_y = this.getCollisionYCorner(ball.position.y)
    var x = ball.position.x - corner_x
    var y = ball.position.y - corner_y
    var c = -2 * (ball.velocity.x * x + ball.velocity.y * y) / (x * x + y * y)
    ball.velocity.x += c * x
    ball.velocity.y += c * y
  }

  klass.prototype.getCollisionXCorner = function(ball_x) {
    if (this.getLeft() < ball_x && ball_x < this.getRight()) {
      return ball_x
    } else if (ball_x < this.getLeft()) {
      return this.getLeft()
    } else {
      return this.getRight()
    }
  }

  klass.prototype.getCollisionYCorner = function(ball_y) {
    if (this.getTop() < ball_y && ball_y < this.getBottom()) {
      return ball_y
    } else if (ball_y < this.getTop()) {
      return this.getTop()
    } else {
      return this.getBottom()
    }
  }

  klass.prototype.hit = function() {
    this.lives--
  }

  klass.prototype.isAlive = function() {
    return this.lives > 0
  }

  klass.prototype.getLeft = function() {
    return this.position.x - this.width / 2
  }

  klass.prototype.getRight = function() {
    return this.position.x + this.width / 2
  }

  klass.prototype.getTop = function() {
    return this.position.y - this.height / 2
  }

  klass.prototype.getBottom = function() {
    return this.position.y + this.height / 2
  }

  return klass
})()
