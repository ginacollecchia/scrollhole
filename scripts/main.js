let pos = 0
let grainPlayer
let isPlaying = false
let scrollSpeed = 0
let playbackSpeed = 0
let buffer

function setup() {
  createCanvas(windowWidth, windowHeight)

  bgCol = color(207, 236, 207) // minty
  background(bgCol)
  textSize(22)

  buffer = new Tone.Buffer('./audio/riddim.mp3')
  grainPlayer = new Tone.GrainPlayer(buffer).toDestination()

}

function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  scrollSpeed = event.delta
  pos += scrollSpeed
  playbackSpeed = Math.log(abs(scrollSpeed) + 1)
  console.log(playbackSpeed) // numbers seem to max out at ~500
  //uncomment to block page scrolling
  //return false
  if (grainPlayer) {
    grainPlayer.playbackRate = playbackSpeed
    if (scrollSpeed < 0) {
      grainPlayer.reverse = true
    } else {
      grainPlayer.reverse = false
    }

    // console.log('player loaded');
  }
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

