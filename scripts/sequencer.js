function SequencerPlayer(buffer) {
  let player = new Tone.Player(buffer)
  
  player.playbackRate = 1
  player.reverse = false
  player.volume.value = 0
  player.loop = true
  
  this.toDestination = function () {
    player.toDestination()
  }

  this.connect = function (node) {
    player.connect(node)
  }

  this.mute = function (mute) {
    player.mute = mute
  }
  
  this.start = function(resumeTime) {
    player.start(0, 0)
  }

  this.fadeOut = function(time) {
    player.fadeOut = time
  }

  this.fadeIn = function(time) {
    player.fadeIn = time
  }
  
  this.loopHasFinished = function () {
    let loopDone = false
    if (time % 8 == 0) {
      loopDone = true
    } else {
      loopDone = false
    }
    return loopDone
  }
  
  this.updatePlayback = function(scrollSpeed, scrollStopped) {
    if (!scrollStopped) {
      player.playbackRate = Math.abs(scrollSpeed)/200 + 0.01
      if (scrollSpeed < 0) {
        player.reverse = true
      } else {
        player.reverse = false
      }
      player.volume.value = 0
    } else {
      // player.playbackRate = 1
      player.volume.value -= 2
    }
  }
  
}