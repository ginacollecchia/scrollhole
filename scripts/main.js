let isPlaying = false, isMuted = false
let scrollSpeed = 0, scrollSpeedSmoothed = 0
let scrollGlide = 0
let soundFiles = ['./audio/stretching.mp3', './audio/bubbling.mp3', './audio/grass.mp3']
let numRegions = 3
let bgCol
let center = { x:0, y:0 }
let muteButton, unmuteButton
let regionIdx = 1
const startTime = Tone.now()

let granularSynthesizer = []
let masterGain

function preload() {
  masterGain = new Tone.Gain()

  for (let i = 0; i < numRegions; i++) {
    let buffer = new Tone.Buffer(soundFiles[i], function() {
      let gs = new GranularSynthesizer(buffer)
      gs.connect(masterGain)
      gs.start(0)

      granularSynthesizer[i] = gs
    })
  }

  masterGain.toDestination()
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
  scrollSpeedSmoothed = Math.log(abs(scrollSpeed) + 1)

  infShapes.scroll(scrollSpeed / 30000.0)
  // granularSynthesizer[0].playback(scrollSpeed, scrollSpeedSmoothed)
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
  masterGain.mute(isMuted)
}
