let isPlaying = false, isMuted = false
let scrollSpeed = 0, scrollSpeedSmoothed = 0
let scrollGlide = 0
let numRegions = 3
let bgCol
let center = { x:0, y:0 }
let muteButton, unmuteButton
let regionIdx = 1
let lastScrollSpeed = 0
const startTime = Tone.now()

// tone nodes
let granularSynthesizer = []
let masterGain

function preload() {
  masterGain = new Tone.Gain().toDestination()
  let soundFiles = ['./audio/stretching.mp3', './audio/bubbling.mp3', './audio/grass.mp3']

  for (let i = 0; i < numRegions; i++) {
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

  bgCol = color(207, 236, 207) // minty
  textSize(22)

  center.x = width / 2.0
  center.y = height / 2.0
  infShapes = new InfiniteShapes()

  infShapes.updateGroup(25)

  // mute button
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

  scrollControl()
}

function mouseWheel(event) {
  scrollZoom(event)
}

function scrollZoom(event) {
  scrollSpeed = event.delta

  scrollSpeedSmoothed = Math.log(abs(scrollSpeed) + 1)
  infShapes.scroll(scrollSpeed / 30000.0)

  lastScrollSpeed = scrollSpeed
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function toggleMute() {
  isMuted = !isMuted
  if (isMuted) {
    masterGain.gain.value = 0.0
  } else {
    masterGain.gain.value = 1.0
  }
}
