// granularSynthesizer.js

function GranularSynthesizer(buffer) {
  let grainPlayer = new Tone.GrainPlayer(buffer)
  let resumeTime = 0

  grainPlayer.playbackRate = 0.25
  grainPlayer.reverse = false
  grainPlayer.volume.value = 0
  grainPlayer.grainSize = 0.5
  grainPlayer.overlap = 0.5
  grainPlayer.loop = true

  this.toDestination = function () {
    grainPlayer.toDestination()
  }

  this.connect = function (node) {
    grainPlayer.connect(node)
  }

  this.mute = function (mute) {
    grainPlayer.mute = mute
  }

  this.pause = function(startTime) {
    let seekTime = Tone.now() - startTime
    this.stop()
    this.resumeTime = seekTime
  }

  this.stop = function() {
    grainPlayer.stop("+0.5") // brief fade out
  }

  this.start = function(resumeTime) {
    grainPlayer.start(0, resumeTime)
  }

  this.update = function(scrollSpeed, scrollStopped) {
    if (scrollStopped) {
      grainPlayer.volume.value -= 2
    } else {
      let scrollSpeedSmoothed = Math.log(Math.abs(scrollSpeed) + 1)
      if (scrollSpeedSmoothed <= 1) {
        scrollSpeedSmoothed = 1
      }

      // map(value, start1, stop1, start2, stop2, [withinBounds])
      grainPlayer.volume.value = map(Math.abs(scrollSpeed), 0, 300, -12, 0, false)

      // overlap: Time: The duration of the cross-fade between successive grains.
      grainPlayer.overlap = 1/Math.abs(scrollSpeed) + 0.3  // 1.3 to .3

      // grainSize: Time: The size of each chunk of audio that the buffer
      // is chopped into and played back at.
      grainPlayer.grainSize = 2/scrollSpeedSmoothed + 0.01 // 2 to 1/3
      grainPlayer.playbackRate = scrollSpeedSmoothed/6 + 0.01 // 0.167 to 1

      if (scrollSpeed < 0) {
        grainPlayer.reverse = true
      } else {
        grainPlayer.reverse = false
      }
    }
  }
}
