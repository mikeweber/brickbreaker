(function() {
  var canvas       = document.getElementById('game')
  var key_listener = new KeyListener()
  BrickBreaker.prototype.setup = function() {
    this.pause()
    this.reset()
    this.lives  = 3
    this.ball.position.y = 430
    this.ball.velocity.y = 1.0
    this.ball.velocity.x = 4.0
    this.bricks = []
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 4; j++) {
        this.bricks.push(new Brick({ x: 40 + i * 70, y: 50 + j * 20 }, 60, 15))
      }
    }
  }
  var game         = new BrickBreaker(500, 500, canvas, key_listener)

  window.addEventListener('keydown', function(e) {
    if (e.key !== ' ') return

    game.togglePaused()
  })
})()

