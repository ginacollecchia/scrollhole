let grainPlayer
let isPlaying = false, isMuted = false
let scrollSpeed = 0, scrollSpeedSmoothed = 0
let playbackSpeed = 0.1, density = 0.5, volume = 0.5, grainSize = 1
let buffer
let bgCol
let center = { x:0, y:0 }
let audioBuffers = []
let muteButton, unmuteButton
let regionIdx = 0

function preload() {
  audioBuffers[0] = new Tone.Buffer('./audio/riddim.mp3')
  grainPlayer = new Tone.GrainPlayer(audioBuffers[regionIdx])
  grainPlayer.playbackRate = playbackSpeed
  grainPlayer.reverse = false
  grainPlayer.volume = volume
  grainPlayer.grainSize = grainSize
  grainPlayer.overlap = density
  grainPlayer.loop = true
  grainPlayer.toMaster()
}

function setup() {
  let cvn = createCanvas(windowWidth, windowHeight)
  cvn.style('display', 'block')

  bgCol = color(207, 236, 207) // minty
  textSize(22)

  center.x = width / 2.0
  center.y = height / 2.0
  infShapes = new InfiniteShapes()

  infShapes.updateGroup(15)

  unmuteButton = createImg('./img/unmuteAudio.png')
  unmuteButton.size(50, 50)
  unmuteButton.position(windowWidth - 70, 10)
  unmuteButton.mousePressed(toggleMute)
  unmuteButton.hide()

  muteButton = createImg('./img/muteAudio.png')
  muteButton.size(50, 50)
  muteButton.position(windowWidth - 70, 10)
  muteButton.mousePressed(toggleMute)
  muteButton.show()

  var options = {
    preventDefault: true
  }
}

function draw() {
  background(bgCol)
  infShapes.draw(center)
  infShapes.update()

  if (isMuted) {
    muteButton.hide()
    unmuteButton.show()
  } else {
    unmuteButton.hide()
    muteButton.show()
  }
}

function scrollZoom(event) {
  scrollSpeed = event.delta
  infShapes.scroll(scrollSpeed / 30000.0)
  
  scrollSpeedSmoothed = Math.log(abs(scrollSpeed) + 1)
  // playbackSpeed = Math.log(abs(scrollSpeed) + 1)
  playbackSpeed = 1
  density = scrollSpeedSmoothed
  // make sure it's not too loud or too quiet
  volume = map(scrollSpeed, -500, 500, 0.2, 1, true)
  // map(value, start1, stop1, start2, stop2, [withinBounds])
  grainSize = map(scrollSpeedSmoothed, 0, 7, 0.01, 1, true)
  console.log("Density = ", density, ", volume = ", volume, ", grainSize = ", grainSize, ", scrollSpeed = ", scrollSpeed, ", scrollSpeedSmoothed = ", scrollSpeedSmoothed)

  grainPlayer.playbackRate = playbackSpeed
  grainPlayer.overlap = 1/density
  grainPlayer.volume = volume
  grainPlayer.grainSize = grainSize
  if (scrollSpeed < 0) {
    grainPlayer.reverse = true
  } else {
    grainPlayer.reverse = false
  }
  
  if (!isPlaying) {
    isPlaying = !isPlaying
    grainPlayer.start()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseWheel(event) {
  scrollZoom(event)
}

function keyPressed(event) {
  
}

function toggleMute() {
  isMuted = !isMuted
  grainPlayer.mute = isMuted
}

// function mouseMoved() {

//   // WORMHOLE BACKGROUND
//   let diameter = windowWidth + 100
//   let thickness = 60
//   var i
//   let numCircles = ceil(windowWidth / thickness) + 1
//   // draw concentric black and white circles in background
//   for (i = numCircles; i >= -1; i--) {
//     strokeWeight(thickness)
//     stroke(255 + 255*Math.pow(-1,i)) // alternate color between black and white
//     noFill()
//     // start with smallest circle. center relative to mouse position and center of screen. outermost circle should be the same every time regardless of mouse position.
//     // circle(windowWidth / 2, windowHeight / 2, diameter - i*thickness)
//     circle((mouseX * i/numCircles + windowWidth/2 * (numCircles - i)/numCircles), (mouseY * i/numCircles + windowHeight/2 * (numCircles - i)/numCircles), diameter - i*thickness)
//     // console.log(diameter - i*thickness)
//   }

//   // draw "path" of circles leading up to center circle
//   // let arcDiameter = windowHeight/2
//   let numArcs = floor(numCircles/2) + 1
//   for (i = 0; i < numCircles; i++) {
//     strokeWeight(thickness)
//     stroke(255 + 255*Math.pow(-1,i)) // alternate color between black and white
//     noFill()
//     arc((mouseX * (numCircles - i)/numCircles + windowWidth/2 * i/numCircles), (i+2)*thickness + (mouseY * (numCircles - i)/numCircles + windowHeight/2 * i/numCircles), (i+3)*thickness, (i+3)*thickness, -PI, PI)
//   }

//   return false
// }

