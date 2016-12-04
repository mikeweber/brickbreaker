(function() {
  var canvas = document.getElementById('game')
  var game  = new BrickBreaker(500, 500, canvas)
  var set_running = document.getElementById('running')
  set_running.addEventListener('click', function() {
    game.running = set_running.checked
    if (game.running) game.run()
  })
  game.run()
})()

