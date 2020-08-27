let isPlaying = false, isMuted = false
let scrollSpeed = 0, scrollSpeedSmoothed = 0
let soundFiles = ['./audio/stretching.mp3', './audio/bubbling.mp3', '../audio/grass.mp3']
let numRegions = 3
let buffer = []
let bgCol
let center = { x:0, y:0 }
let muteButton, unmuteButton
let regionIdx = 1
let granularSynthesizer = []
const startTime = Tone.now()
var i

function preload() {
  for (let i = 0; i < numRegions; i++) {
    buffer[i] = new Tone.Buffer(soundFiles[i])
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

  // granular synthesizer constructor: buffer, playback speed, reverse bool, volume, grain size, overlap, loop bool
  granularSynthesizer[0] = new GranularSynthesizer(buffer[0], 0.1, false, 0.5, 0.5, 0.5, true)
  granularSynthesizer[1] = new GranularSynthesizer(buffer[1], 1, false, 0.5, 0.5, 0.5, true)
  granularSynthesizer[2] = new GranularSynthesizer(buffer[2], 1, false, 0.5, 0.5, 0.5, true)

  const masterGain = new Tone.Gain()
  for (i = 0; i < numRegions; i++) {
    granularSynthesizer[i].connect(masterGain)
  }
  masterGain.toDestination()

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
  scrollSpeedSmoothed = Math.log(Math.abs(scrollSpeed) + 1)
  infShapes.scroll(scrollSpeed / 30000.0)

  granularSynthesizer[regionIdx].playback(scrollSpeed, scrollSpeedSmoothed, startTime)
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
  for (i = 0; i < numRegions; i++) {
    granularSynthesizer[i].mute(isMuted)
  }
}
