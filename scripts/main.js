let isMuted = false, isStarted = false
let scrollGlide = 0
let numRegions = 3, regionIdx = 0
let bgCol
let center = { x:0, y:0 }
let muteButton, unmuteButton, startButton, pauseButton
let scrollSpeed = 0
const startTime = Tone.now()
let gain = 0.9
let position = 0

// tone nodes
let granularSynthesizer = []
let masterGain

// mute button pink color RGB: 225, 100, 225

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
}

function setup() {
  let cvn = createCanvas(windowWidth, windowHeight)
  cvn.style('display', 'block')

  // bgCol = color(207, 236, 207) // minty
  bgCol = color('white') // white
  textSize(22)

  center.x = width / 2.0
  center.y = height / 2.0
  infShapes = new InfiniteShapes()

  infShapes.updateGroup(25)

  // mute button
  unmuteButton = createImg('./img/unmuteButtonPink.png')
  unmuteButton.size(50, 50)
  unmuteButton.position(windowWidth - 70, 10)
  unmuteButton.mousePressed(toggleMute)
  unmuteButton.hide()

  muteButton = createImg('./img/muteButtonPink.png')
  muteButton.size(50, 50)
  muteButton.position(windowWidth - 70, 10)
  muteButton.mousePressed(toggleMute)
  muteButton.show()
  
  // start button
  pauseButton = createImg('./img/pauseButtonPink.png')
  pauseButton.size(50, 50)
  pauseButton.position(windowWidth - 130, 10)
  pauseButton.mousePressed(toggleStart)
  pauseButton.hide()

  startButton = createImg('./img/playButtonPink.png')
  startButton.size(50, 50)
  startButton.position(windowWidth - 130, 10)
  startButton.mousePressed(toggleStart)
  startButton.show()

  var options = {
    preventDefault: true
  }
}

function scrollControl() {
  let threshold = 5
  let increment = 1

  if (scrollSpeed < -threshold && scrollSpeed != 0) {
    scrollSpeed += increment
  } else if(scrollSpeed > threshold && scrollSpeed != 0) {
    scrollSpeed -= increment
  } else {
    scrollSpeed = 0
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
  
  if (isStarted) {
    startButton.hide()
    pauseButton.show()
  } else {
    pauseButton.hide()
    startButton.show()
  }
}

function scrollZoom(event) {
  scrollSpeed = event.delta
  let scrollSpeedSmoothed = Math.log(Math.abs(scrollSpeed) + 1)
  infShapes.scroll(scrollSpeed / 30000.0)
  let currentRegion = regionIdx
  
  position += scrollSpeed
  if (position > 0) {
    regionIdx = Math.floor(position/20000) % numRegions
  } else {
    regionIdx = Math.abs(Math.ceil(position/20000) % numRegions)
  }
  
  // handle transition to a new region
  if (currentRegion != regionIdx) {
    granularSynthesizer[regionIdx].update(scrollSpeed, scrollSpeedSmoothed)
    granularSynthesizer[currentRegion].fadeOut(2) // fade out the current granular synth over 2 seconds
    granularSynthesizer[currentRegion].update(scrollSpeed, scrollSpeedSmoothed)
    granularSynthesizer[regionIdx].fadeIn(2)
    console.log("Transitioning from region ", currentRegion, " to region ", regionIdx)
  } else {
    granularSynthesizer[currentRegion].update(scrollSpeed, scrollSpeedSmoothed)
  }

  scrollControl()
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

function toggleStart() {
  isStarted = !isStarted
  if (!isStarted) {
    // Tone.stop()--not a thing
  } else {
    Tone.start()
  }
}

function triggerNewRegion(startRegion, endRegion) {
  
}
