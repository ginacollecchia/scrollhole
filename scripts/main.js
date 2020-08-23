let grainPlayer
let isPlaying = false
let scrollSpeed = 0
let playbackSpeed = 0
let buffer
let bgCol
let center = { x:0, y:0 }
let audioBuffers = []
let muteButton, unmuteButton
let region = 0
let isMuted = false

function preload() {
  audioBuffers[0] = new Tone.Buffer('./audio/riddim.mp3')
}

function setup() {
  let cvn = createCanvas(windowWidth, windowHeight)
  cvn.style('display', 'block')

  bgCol = color(207, 236, 207) // minty
  textSize(22)

  grainPlayer = new Tone.GrainPlayer(audioBuffers[region]).toDestination()

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

function scrollZoom(event) {
  scrollSpeed = event.delta
  playbackSpeed = Math.log(abs(scrollSpeed) + 1)

  if (grainPlayer) {
    grainPlayer.playbackRate = playbackSpeed
    if (scrollSpeed < 0) {
      grainPlayer.reverse = true
    } else {
      grainPlayer.reverse = false
    }
  }

  infShapes.scroll(event.delta / 30000.0)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseWheel(event) {
  scrollZoom(event)
}

function keyPressed(event) {
  if (grainPlayer) {
    if (isPlaying) {
      // we were playing, so we'll stop
      isPlaying = !isPlaying
      grainPlayer.stop()
    } else {
      // we weren't playing, so we'll start
      isPlaying = !isPlaying;
      grainPlayer.start()
    }
  }
}

function toggleMute() {
  isMuted = !isMuted
}

function draw() {
  background(bgCol)
  infShapes.draw(center)
  infShapes.update()

  if (isMuted) {
    unmuteButton.show()
    muteButton.hide()
  } else {
    unmuteButton.hide()
    muteButton.show()
  }
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

