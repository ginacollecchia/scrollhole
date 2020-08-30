let numRegions = 3, currentRegion = 0
let center = { x:0, y:0 }
let mouseCenter = { x:0, y:0 }
let scaledCenter = { x:0.0, y:0.0 }
const startTime = Tone.now()
let gain = 0.9
let position = 0
let scroll = new Scroll(numRegions)

let mouseFollow = { x: 0, y: 0 }

// tone nodes
let granularSynthesizer = []
let granularGains = []
let masterGain

let muteButton, unmuteButton, clickForSound, logo // images
let isMuted = false


function preload() {
  masterGain = new Tone.Gain().toDestination()
  // let soundFiles = ['./audio/stretching.mp3', './audio/bubbling.mp3', './audio/grass.mp3']
  // let soundFiles = ['./audio/stretching.mp3']
  let soundFiles = ['./audio/stretchingStereo.mp3', './audio/bubblingOcean.mp3', './audio/grassStorm.mp3']

  for (let i = 0; i < soundFiles.length; i++) {
    let buffer = new Tone.Buffer(soundFiles[i], function() {
      let gs = new GranularSynthesizer(buffer)
      let gg = new Tone.Gain()
      gg.gain.value = 0.0

      gs.connect(gg)
      gg.connect(masterGain)
      gs.start(0)

      granularGains.push(gg)
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
  // adjust denominator of argument for speed
  infShapes.scroll(scroll.value / 30000)

  scroll.update()

  // handle transition to a new region
  if (scroll.inTransition && granularSynthesizer[scroll.region] && granularSynthesizer[scroll.nextRegion]) {
    // console.log("Transitioning from region ", scroll.nextRegion, " to region ", scroll.region)
    granularSynthesizer[scroll.region].update(scroll.value, scroll.stopped)
    granularGains[scroll.region].gain.value = scroll.regionGain
    granularSynthesizer[scroll.nextRegion].update(scroll.value, scroll.stopped)
    granularGains[scroll.nextRegion].gain.value = scroll.nextRegionGain
    console.log("Next region gain = ", scroll.nextRegionGain, "Current region gain = ", scroll.regionGain)
  } else if (granularSynthesizer[scroll.region]) {
    granularSynthesizer[scroll.region].update(scroll.value, scroll.stopped)
    granularGains[scroll.region].gain.value = scroll.regionGain
    console.log("Current region gain = ", scroll.regionGain)
  }
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

function mousePressed() {
  infShapes.clicked()
}

function scrollZoom(event) {
  scroll.scrollZoom(event.delta)
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



