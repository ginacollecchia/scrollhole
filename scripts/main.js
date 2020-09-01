let numRegions = 3, currentRegion = 0
let center = { x:0, y:0 }
let mouseCenter = { x:0, y:0 }
let scaledCenter = { x:0.0, y:0.0 }
const startTime = Tone.now()
let gain = 0.9
let position = 0
let scroll = new Scroll(numRegions)

let mouseFollow = { x: 0, y: 0 }
let radialBackground

// tone nodes
let granularSynthesizer = []
let granularGains = []
let masterGain
let lastTouchY

let muteButton, unmuteButton, logo // images
let isMuted = false

let rColors = [
  {
    inner: {
      h: 0,
      s: 359,
      b: 359,
    },
    outer: {
      h: 180,
      s: 359,
      b: 359,
    }
  },
  {
    inner: {
      h: 120,
      s: 359,
      b: 359,
    },
    outer: {
      h: 300,
      s: 359,
      b: 359,
    }
  },
  {
    inner: {
      h: 240,
      s: 0,
      b: 359,
    },
    outer: {
      h: 60,
      s: 0,
      b: 359,
    }
  },
]

function preload() {
  masterGain = new Tone.Gain().toDestination()
  // let soundFiles = ['./audio/stretchingStereo.mp3', './audio/bubblingOcean.mp3', './audio/grassStorm.mp3']
  let soundFiles = ['./audio/stretchingMono.mp3', './audio/bubblingOceanMono.mp3', './audio/grassStormChimesMono.mp3']

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
  mouseFollow.x = center.x
  mouseFollow.y = center.y

  infShapes = new InfiniteShapes()

  infShapes.updateGroup(10)

  loadImages()

  let bgCtr = { x: center.x, y: center.y }
  radialBackground = new RadialBackground(center, rColors[0].inner, rColors[0].outer)

  var options = {
    preventDefault: true
  }
}

function interpVals(v1, v2) {
  let dist = (v2 - v1)
  let val = v1 + dist * scroll.hueScalar

  return ((val % 360) + 360) % 360
}
function interpColors(c1, c2) {
  let h = interpVals(c1.h, c2.h)
  let s = interpVals(c1.s, c2.s)
  let b = interpVals(c1.b, c2.b)

  return {
    h: h,
    s: s,
    b: b,
  }
}


let wheelDelta = 0
let alpha = 0.0
let alphaInc = 1.0 / 60.0

function draw() {
  clear()

  let inner = interpColors(rColors[scroll.region].inner, rColors[scroll.nextRegion].inner)
  let outer = interpColors(rColors[scroll.region].outer, rColors[scroll.nextRegion].outer)

  mouseFollow = pointBetweenPoints({ x: mouseX, y: mouseY }, mouseFollow, 0.92)

  if (alpha < 1.0) {
    alpha += alphaInc
  }

  radialBackground.draw(mouseFollow, inner, outer, alpha)

  scaledCenter.x = (mouseFollow.x / width - 0.5)
  scaledCenter.y = (mouseFollow.y / height - 0.5)

  if (isMuted) {
    muteButton.hide()
    unmuteButton.show()
  } else {
    unmuteButton.hide()
    muteButton.show()
  }

  logo.show()

  infShapes.draw(center, scaledCenter, scroll.region, scroll.nextRegion, scroll.inTransition, scroll.regionGain, scroll.nextRegionGain)
  infShapes.update(scroll.regionPosition, scroll.regionIdx)
  // adjust denominator of argument for speed
  infShapes.scroll(scroll.value / 15000)

  scroll.update()

  // handle transition to a new region
  if (scroll.inTransition && granularSynthesizer[scroll.region] && granularSynthesizer[scroll.nextRegion]) {
    granularSynthesizer[scroll.region].update(scroll.value, scroll.stopped)
    granularGains[scroll.region].gain.value = scroll.regionGain
    granularSynthesizer[scroll.nextRegion].update(scroll.value, scroll.stopped)
    granularGains[scroll.nextRegion].gain.value = scroll.nextRegionGain
  } else if (granularSynthesizer[scroll.region]) {
    granularSynthesizer[scroll.region].update(scroll.value, scroll.stopped)
    granularGains[scroll.region].gain.value = scroll.regionGain
  }

  if (wheelDelta > 0) {
    wheelDelta -= 3
  } else if (wheelDelta < 0) {
    wheelDelta += 3
  }
}

function loadImages() {
  // logo
  logo = createImg('./img/scrollholeLogo.png')
  logo.id('logo')
  logo.size(476, 100)
  logo.position(25, 25)

  // mute button
  unmuteButton = createImg('./img/unmuteButtonGreenBlack.png')
  unmuteButton.id('unmute')
  unmuteButton.size(80, 80)
  unmuteButton.position(windowWidth - 110, 25)
  unmuteButton.mousePressed(toggleMute)

  muteButton = createImg('./img/muteButtonGreenBlack.png')
  muteButton.id('mute')
  muteButton.size(80, 80)
  muteButton.position(windowWidth - 110, 25)
  muteButton.mousePressed(toggleMute)

  if (Tone.context.state !== 'running') {
    isMuted = true
  }
}

function mousePressed() {
  //infShapes.clicked()
}

function mouseWheel(event) {
  if (event.delta > 3 || event.delta < -3) {
    scroll.scrollZoom(event.delta)
  } else {
    wheelDelta += event.delta
    scroll.scrollZoom(wheelDelta)
    console.log(wheelDelta)
  }
}

// mobile interactions
let lastMouseY = 0
function touchMoved() {
  let mouseYMapped = map(mouseY, 0, height, width/2.0, -width/2.0)
  let mouseYDelta = lastMouseY - mouseYMapped
  scroll.scrollZoom(mouseYDelta)
  lastMouseY = mouseYMapped
}

function mouseClicked() {
  if (Tone.context.state !== 'running') {
    Tone.start()
    isMuted = false
  }
}

function touchStarted() {
  if (Tone.context.state != 'running') {
    Tone.start()
    isMuted = false
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
