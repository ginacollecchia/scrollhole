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
    // console.log("Pausing audio at ", seekTime)
  }

  this.stop = function() {
    grainPlayer.stop("+0.5") // brief fade out
  }

  this.start = function(resumeTime) {
    grainPlayer.start(0, resumeTime)
  }

  this.fadeOut = function(time) {
    grainPlayer.fadeOut = time
  }

  this.fadeIn = function(time) {
    grainPlayer.fadeIn = time
  }

  this.scroll = function() {

  }

  this.update = function(scrollSpeed, scrollStopped) {
    if (scrollStopped) {
      grainPlayer.volume.value -= 2
    } else {
      grainPlayer.volume.value = 0
    }
    
    let scrollSpeedSmoothed = Math.log(Math.abs(scrollSpeed) + 1)
    if (scrollSpeedSmoothed <= 1) {
      scrollSpeedSmoothed = 1
    }

    // make sure it's not too loud or too quiet
    // grainPlayer.volume = map(scrollSpeed, -500, 500, 0.2, 1, true)
    /* if (scrollSpeedSmoothed > 6) {
      grainPlayer.volume.value = 0
    } else {
      grainPlayer.volume.value = scrollSpeedSmoothed/2 - 3
      if (grainPlayer.volume.value > 0) {
        grainPlayer.volume.value = 1
      }
    }*/
      
    grainPlayer.overlap = Math.abs(scrollSpeed)/20
    // map(value, start1, stop1, start2, stop2, [withinBounds])
    grainPlayer.grainSize = 2/scrollSpeedSmoothed + 0.01
    grainPlayer.playbackRate = Math.abs(scrollSpeed)/200 + 0.01
    if (scrollSpeed < 0) {
      grainPlayer.reverse = true
    } else {
      grainPlayer.reverse = false
    }

    // console.log("Density = ", grainPlayer.overlap, ", volume = ", grainPlayer.volume.value, ", grainSize = ", grainPlayer.grainSize, ", playbackSpeed = ", grainPlayer.playbackRate, ", scrollSpeed = ", scrollSpeed, ", scrollSpeedSmoothed = ", scrollSpeedSmoothed)
  }

}
