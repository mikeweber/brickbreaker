(function() {
  var canvas       = document.getElementById('game')
  var key_listener = new KeyListener()
  var game         = new BrickBreaker(500, 500, canvas, key_listener)

  window.addEventListener('keydown', function(e) {
    if (e.key !== ' ') return

    game.togglePaused()
  })
})()

