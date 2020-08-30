let numRegions = 3, currentRegion = 0
let center = { x:0, y:0 }
let mouseCenter = { x:0, y:0 }
let scaledCenter = { x:0.0, y:0.0 }
let scrollSpeed = 0
const startTime = Tone.now()
let gain = 0.9
let position = 0
let scroll = new Scroll(numRegions)

let mouseFollow = { x: 0, y: 0 }

// tone nodes
let granularSynthesizer = []
let masterGain

let muteButton, unmuteButton, clickForSound, logo // images
let isMuted = false


function preload() {
  masterGain = new Tone.Gain().toDestination()
  let soundFiles = ['./audio/stretching.mp3', './audio/bubbling.mp3', './audio/grass.mp3']
  // let soundFiles = ['./audio/stretching.mp3']

  for (let i = 0; i < soundFiles.length; i++) {
    let buffer = new Tone.Buffer(soundFiles[i], function() {
      let gs = new GranularSynthesizer(buffer)
      gs.connect(masterGain)
      gs.start(0)

      granularSynthesizer.push(gs)
    })
  }
  
  loadFont('./fonts/effects-eighty.otf')
}

function setup() {
  let cvn = createCanvas(windowWidth, windowHeight)
  cvn.style('display', 'block')
  frameRate(40)

  center.x = width / 2.0
  center.y = height / 2.0
  mouseFollow = center

  infShapes = new InfiniteShapes()

  infShapes.updateGroup(7)
  
  loadImages()
  
  var options = {
    preventDefault: true
  }
}

function draw() {
  background('white')

  mouseFollow = pointBetweenPoints({ x: mouseX, y: mouseY }, mouseFollow, 0.92)

  scaledCenter.x = (mouseFollow.x / width - 0.5)
  scaledCenter.y = (mouseFollow.y / height - 0.5)

  if (isMuted) {
    muteButton.hide()
    unmuteButton.show()
  } else {
    unmuteButton.hide()
    muteButton.show()
  }

  if (Tone.context.state !== 'running') {
    clickForSound.show()
  } else {
    clickForSound.hide()
  }

  logo.show()

  infShapes.draw(center, scaledCenter)
  infShapes.update(scroll.regionPosition, scroll.regionIdx)
  infShapes.scroll(scroll.value / 30000)

  scroll.update()
}

function loadImages() {
  // logo
  logo = createImg('./img/scrollholeLogo.png')
  logo.size(488, 75)
  logo.position(10, 10)

  // mute button
  unmuteButton = createImg('./img/unmuteButtonGreenBlack.png')
  unmuteButton.size(50, 50)
  unmuteButton.position(windowWidth - 70, 10)
  unmuteButton.mousePressed(toggleMute)

  muteButton = createImg('./img/muteButtonGreenBlack.png')
  muteButton.size(50, 50)
  muteButton.position(windowWidth - 70, 10)
  muteButton.mousePressed(toggleMute)

  // start audio dialog
  clickForSound = createDiv('click anywhere to start sound!')
  clickForSound.style('font-family', 'Monaco') // fallback font
  clickForSound.style('font-family', 'EffectsEighty')
  clickForSound.style('text-align', 'center')
  clickForSound.style('color', 'black')
  clickForSound.style('font-size', '18px')
  clickForSound.position(520, 35)
}

function scrollZoom(event) {
  scroll.scrollZoom(event.delta)

  scrollSpeed = event.delta
  let scrollSpeedSmoothed = Math.log(Math.abs(scrollSpeed) + 1)

  // handle transition to a new region
  if (currentRegion != scroll.region) {
    granularSynthesizer[scroll.region].update(scrollSpeed, scrollSpeedSmoothed)
    granularSynthesizer[currentRegion].fadeOut(2) // fade out the current granular synth over 2 seconds
    granularSynthesizer[currentRegion].update(scrollSpeed, scrollSpeedSmoothed)
    granularSynthesizer[scroll.region].fadeIn(2)

    console.log("Transitioning from region ", currentRegion, " to region ", scroll.region)
  } else {
    granularSynthesizer[currentRegion].update(scrollSpeed, scrollSpeedSmoothed)
  }

  currentRegion = scroll.region
}

function mouseWheel(event) {
  scrollZoom(event)
}

function mouseClicked() {
  if (Tone.context.state !== 'running') {
    Tone.start()
  } 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function toggleMute() {
  isMuted = !isMuted
  if (isMuted) {
    masterGain.gain.value = 0.0
  } else {
    masterGain.gain.value = gain
  }
}

function pointBetweenPoints(p1, p2, perc) {
  return {
    x: p1.x + perc * (p2.x - p1.x),
    y: p1.y + perc * (p2.y - p1.y),
  }
}
