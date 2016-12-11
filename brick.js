window.Brick = (function() {
  var klass = function Brick(position, width, height) {
    this.position      = position
    this.width         = width
    this.height        = height
  }

  klass.prototype.draw = function(context) {
    context.save()
    context.fillStyle   = '#393'
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

  klass.prototype.collide = function(ball) {
    var ball_distance = { x: Math.abs(ball.position.x - this.position.x), y: Math.abs(ball.position.y - this.position.y) }
    // Too far away to possibly interact
    if (ball_distance.x > (this.width / 2 + ball.radius) || ball_distance.y > (this.height / 2 + ball.radius)) return false
    // Definitely interacting
    if (ball_distance.x <= this.width / 2 || ball_distance.y <= this.height / 2) {
      if (ball.position.x >= this.getLeft() && this.getRight() >= ball.position.x) {
        // If the ball is below the brick, bounce down
        if (ball.position.y > this.position.y) {
          ball.bounceDown(this.getBottom())
        } else {
          // If the ball is above the brick, bounce up
          ball.bounceUp(this.getTop())
        }
      } else {
        // if the ball is to the left of the brick, set the right edge of the
        // ball to the to the left side of the brick
        if (ball.position.x < this.position.x) {
          ball.bounceLeft(this.getLeft())
        } else {
          // else set the ball position to the left side
          ball.bounceRight(this.getRight())
        }
      }
      return true
    }

    // Might be interacting on a corner. This is the most
    // expensive check, so save it for last.
    var corner_distance = (ball_distance.x - this.width / 2) * (ball_distance.x - this.width / 2) + (ball_distance.y - this.height / 2) * (ball_distance.y - this.height / 2)

    if (corner_distance <= ball.radius * ball.radius) {
      return true
    }
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
