window.KeyListener = (function() {
  var klass = function KeyListener() {
    this.active_keys = []
    this.observe()
  }

  klass.prototype.observe = function() {
    window.addEventListener('keydown', function(e) {
      if (this.getObservedKeys().indexOf(e.key) > -1) {
        this.activateKey(e.key)
      }
    }.bind(this))
    window.addEventListener('keyup', function(e) {
      this.deactivateKey(e.key)
    }.bind(this))
  }

  klass.prototype.isActive = function(key) {
    return this.getActiveKeys().indexOf(key) > -1
  }

  klass.prototype.activateKey = function(key) {
    if (this.getActiveKeys().indexOf(key) > -1) return

    this.active_keys.push(key)
  }

  klass.prototype.deactivateKey = function(key) {
    var index = this.getActiveKeys().indexOf(key)
    if (index == -1) return

    this.getActiveKeys().splice(index, 1)
  }

  klass.prototype.getActiveKeys = function() {
    return this.active_keys
  }

  klass.prototype.getObservedKeys = function() {
    return ['ArrowLeft', 'ArrowRight', ' ']
  }

  return klass
})()
