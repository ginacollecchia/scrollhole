let isMuted = false, isStarted = false
let numRegions = 3
let bgCol
let center = { x:0, y:0 }
let mouseCenter = { x:0, y:0 }
let scaledCenter = { x:0.0, y:0.0 }

let muteButton, unmuteButton, clickForSound, logo, eighties_font, aboutButton
let scrollSpeed = 0
const startTime = Tone.now()
let gain = 0.9
let position = 0
let scroll = new Scroll(numRegions) // is scroll overloaded?
let currentRegion = 0

let mouseFollow = { x: 0, y: 0 }

// tone nodes
let granularSynthesizer = []
let granularGains = []
let masterGain

// mute button pink color RGB: 225, 100, 225

function preload() {
  masterGain = new Tone.Gain().toDestination()
  let soundFiles = ['./audio/stretching.mp3', './audio/bubbling.mp3', './audio/grass.mp3']
  // let soundFiles = ['./audio/stretching.mp3']

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

  eighties_font = loadFont('./fonts/effects-eighty.otf', function() {
    console.log('loaded font', eighties_font)
  })
}

function setup() {
  console.log(granularGains)
  let cvn = createCanvas(windowWidth, windowHeight)
  cvn.style('display', 'block')
  frameRate(40)

  // bgCol = color(207, 236, 207) // minty
  bgCol = color('white') // white
  textSize(22)

  center.x = width / 2.0
  center.y = height / 2.0
  mouseFollow = center

  infShapes = new InfiniteShapes()

  infShapes.updateGroup(7)
  // logo
  logo = createImg('./img/scrollhole_logo.png')
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
  // clickForSound.style('font-family', 'EffectsEighty') // no worky...
  clickForSound.style('font-family', 'Courier')
  clickForSound.style('text-align', 'center')
  clickForSound.style('color', 'black')
  clickForSound.style('font-size', '18px')
  clickForSound.position(520, 30)

  // about link
  aboutButton = createImg('./img/what.png')
  aboutButton.size(80, 30)
  aboutButton.position(windowWidth - 170, 20)
  aboutButton.mousePressed(showAboutModalDialog)

  var options = {
    preventDefault: true
  }
}

function draw() {
  background(bgCol)

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

  if (!isStarted) {
    clickForSound.show()
  } else {
    clickForSound.hide()
  }

  logo.show()
  aboutButton.show()

  infShapes.draw(center, scaledCenter)
  infShapes.update(scroll.regionPosition, scroll.regionIdx)
  infShapes.scroll(scroll.value / 50000)

  scroll.update()
}

function scrollZoom(event) {
  scroll.scrollZoom(event.delta)

  scrollSpeed = event.delta
  let scrollSpeedSmoothed = Math.log(Math.abs(scrollSpeed) + 1)

  // handle transition to a new region
  if (currentRegion != scroll.region) {
    granularSynthesizer[scroll.region].update(scrollSpeed, scrollSpeedSmoothed)
    // granularSynthesizer[currentRegion].fadeOut(2) // fade out the current granular synth over 2 seconds
    granularSynthesizer[currentRegion].update(scrollSpeed, scrollSpeedSmoothed)
    // granularSynthesizer[scroll.region].fadeIn(2)

    console.log("Transitioning from region ", currentRegion, " to region ", scroll.region)
  } else {
    granularSynthesizer[currentRegion].update(scrollSpeed, scrollSpeedSmoothed)
  }

  granularGains[scroll.region].gain.value = scroll.regionGain
  granularGains[scroll.nextRegion].gain.value = scroll.nextRegionGain
}

function mouseWheel(event) {
  scrollZoom(event)
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

function showAboutModalDialog() {

}

function mouseClicked() {
  if (!isStarted) {
    isStarted = !isStarted
    Tone.start()
    clickForSound.hide()
  }
}

function pointBetweenPoints(p1, p2, perc) {
  return {
    x: p1.x + perc * (p2.x - p1.x),
    y: p1.y + perc * (p2.y - p1.y),
  }
}

function triggerNewRegion(startRegion, endRegion) {

}
