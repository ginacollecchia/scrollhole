let resumeTime = 0
let grainPlayer

function GranularSynthesizer(buffer, playbackSpeed, reverse, volume, grainSize, density, loop) {
  grainPlayer = new Tone.GrainPlayer(buffer)
  grainPlayer.playbackRate = playbackSpeed
  grainPlayer.reverse = reverse
  grainPlayer.volume.value = volume
  grainPlayer.grainSize = grainSize
  grainPlayer.overlap = density
  grainPlayer.loop = loop

  this.toDestination = function () {
    grainPlayer.toDestination()
  }

  this.connect = function (node) {
    grainPlayer.connect(node)
  }

  this.isPlaying = false
  this.mute = function (mute) {
    grainPlayer.mute = mute
  }

  this.pause = function(startTime) {
    let seekTime = Tone.now() - startTime
    this.stop()
    this.resumeTime = seekTime
    console.log("Pausing audio at ", seekTime)
  }

  this.stop = function() {
    grainPlayer.stop("+0.5") // brief fade out
  }

  this.start = function(resumeTime) {
    grainPlayer.start(0, resumeTime)
  }

  this.playback = function(scrollSpeed, scrollSpeedSmoothed, startTime) {
    if (this.isPlaying) {
      this.isPlaying = false
      this.pause(startTime)
    }

    grainPlayer.overlap = scrollSpeedSmoothed
    // make sure it's not too loud or too quiet
    // grainPlayer.volume = map(scrollSpeed, -500, 500, 0.2, 1, true)
    if (!grainPlayer.mute) {
      if (scrollSpeedSmoothed > 6) {
        grainPlayer.volume.value = 0
      } else {
        grainPlayer.volume.value = scrollSpeedSmoothed - 6
      }
    }
    // map(value, start1, stop1, start2, stop2, [withinBounds])
    grainPlayer.grainSize = scrollSpeedSmoothed + 0.01
    grainPlayer.playbackRate = scrollSpeedSmoothed + 0.01
    if (scrollSpeed < 0) {
      grainPlayer.reverse = true
      // scrollSpeedSmoothed *= -1
    } else {
      grainPlayer.reverse = false
    }

    console.log("Density = ", grainPlayer.overlap, ", volume = ", grainPlayer.volume.value, ", grainSize = ", grainPlayer.grainSize, ", playbackSpeed = ", grainPlayer.playbackRate, ", scrollSpeed = ", scrollSpeed, ", scrollSpeedSmoothed = ", scrollSpeedSmoothed)

    if (!this.isPlaying) {
      this.isPlaying = true
      grainPlayer.start(0, resumeTime) // start it immediately and seek to resumeTime
    }
  }

}
