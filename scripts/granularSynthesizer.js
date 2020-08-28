// granularSynthesizer.js

function GranularSynthesizer(buffer) {
  let grainPlayer = new Tone.GrainPlayer(buffer)
  let resumeTime = 0

  grainPlayer.playbackRate = 1.0
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

  this.load = function(buffer) {
    grainPlayer
  }

  this.isPlaying = true
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

  this.scroll = function() {

  }

  this.playback = function(scrollSpeed, scrollSpeedSmoothed) {
    grainPlayer.overlap = scrollSpeedSmoothed

    // make sure it's not too loud or too quiet
    // grainPlayer.volume = map(scrollSpeed, -500, 500, 0.2, 1, true)
    if (scrollSpeedSmoothed > 6) {
      grainPlayer.volume.value = 0
    } else {
      grainPlayer.volume.value = scrollSpeedSmoothed - 6
    }
    // map(value, start1, stop1, start2, stop2, [withinBounds])
    grainPlayer.grainSize = map(scrollSpeedSmoothed, 0, 7, 0.01, 1, true)
    grainPlayer.playbackRate = scrollSpeedSmoothed

    if (scrollSpeed < 0) {
      grainPlayer.reverse = true
      scrollSpeedSmoothed *= -1
    } else {
      grainPlayer.reverse = false
    }
  }
}
