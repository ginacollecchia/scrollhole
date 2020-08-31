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
let sequencerPlayer = []
let sequencerGains = []

let sequencerIDs = ['0', '1', '2', '3', '01', '02', '03', '12', '13', '23', '012', '013', '123', '0123']
let currentSequence, nextSequence, sequencerSelections = []
let bpm = 120


let muteButton, unmuteButton, clickForSound, logo, sequencerButtonsOn = [], sequencerButtonsOff = [] // images
let isMuted = false, isSelected = [false, false, false, false], sequencerOn = false

// let shOrange = color(255, 90, 0), shYellow = color(248, 239, 0), shGreen = color(72, 254, 30), shBlue = color(0, 234, 232), shPink = color(235, 3, 138)

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
  
  let sequencerFiles = ['./audio/sequencer/0.mp3', './audio/sequencer/1.mp3', './audio/sequencer/2.mp3', './audio/sequencer/3.mp3', './audio/sequencer/01.mp3', './audio/sequencer/02.mp3', 
  './audio/sequencer/03.mp3', './audio/sequencer/12.mp3', './audio/sequencer/13.mp3', './audio/sequencer/23.mp3', './audio/sequencer/012.mp3', './audio/sequencer/013.mp3', 
  './audio/sequencer/123.mp3', './audio/sequencer/0123.mp3']
  
  /* for (let i = 0; i < sequencerFiles.length; i++) {
    let buffer = new Tone.Buffer(sequencerFiles[i], function() {
      let sp = new SequencerPlayer(buffer)
      let sg = new Tone.Gain()
      sg.gain.value = 0.0
      
      sp.connect(sg)
      sg.connect(masterGain)
      sp.start(0)
      
      sequencerGains.push(sg)
      sequencerPlayer.push(sp)
    })
  } */
  
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
  
  for (var i = 0; i < 4; i++) {
    if (isSelected[i]) {
      sequencerButtonsOff[i].hide()
      sequencerButtonsOn[i].show()
    } else {
      sequencerButtonsOn[i].hide()
      sequencerButtonsOff[i].show()
    }
  }
  
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
    // console.log("Next region gain = ", scroll.nextRegionGain, "Current region gain = ", scroll.regionGain)
  } else if (granularSynthesizer[scroll.region]) {
    granularSynthesizer[scroll.region].update(scroll.value, scroll.stopped)
    granularGains[scroll.region].gain.value = scroll.regionGain
    // console.log("Current region gain = ", scroll.regionGain)
  }
  
  // update playback rate of sequencer
  /* if (sequencerOn && sequencerPlayer[currentSequence].loopHasFinished && nextSequence != currentSequence && sequencerPlayer[currentSequence] && sequencerPlayer[nextSequence]) {
    sequencerGains[currentSequence].gain.value = 0
    sequencerPlayer[nextSequence].updatePlayback(scroll.value, scroll.stopped)
    sequencerGains[nextSequence].gain.value = 1
    currentSequence = nextSequence
  } else if (sequencerOn && sequencerPlayer[currentSequence]) {
    sequencerPlayer[currentSequence].updatePlayback(scroll.value, scroll.stopped)
    sequencerGains[currentSequence].gain.value = 1
  } */
  
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
  
  // sequencer buttons
  sequencerButtonsOff.push(createImg('./img/unselectedSequencerButton1.png')) // actually the 0th, but user will see a 1
  sequencerButtonsOff.push(createImg('./img/unselectedSequencerButton2.png'))
  sequencerButtonsOff.push(createImg('./img/unselectedSequencerButton3.png'))
  sequencerButtonsOff.push(createImg('./img/unselectedSequencerButton4.png'))
  sequencerButtonsOn.push(createImg('./img/selectedSequencerButton1.png'))
  sequencerButtonsOn.push(createImg('./img/selectedSequencerButton2.png'))
  sequencerButtonsOn.push(createImg('./img/selectedSequencerButton3.png'))
  sequencerButtonsOn.push(createImg('./img/selectedSequencerButton4.png'))
  for (var i = 0; i < 4; i++) {
    sequencerButtonsOff[i].size(40, 40)
    // sequencerButtonsOff[i].mousePressed(toggleSequencerButtons(i)) // javascript doesn't like a callback with arguments?
    sequencerButtonsOff[i].position(10+50*i, 90)
    sequencerButtonsOn[i].size(40, 40)
    sequencerButtonsOn[i].position(10+50*i, 90)
    // sequencerButtonsOn[i].mousePressed(toggleSequencerButtons(i))
    
  }
  sequencerButtonsOff[0].mousePressed(toggleSequencerButton0)
  sequencerButtonsOff[1].mousePressed(toggleSequencerButton1)
  sequencerButtonsOff[2].mousePressed(toggleSequencerButton2)
  sequencerButtonsOff[3].mousePressed(toggleSequencerButton3)
  sequencerButtonsOn[0].mousePressed(toggleSequencerButton0)
  sequencerButtonsOn[1].mousePressed(toggleSequencerButton1)
  sequencerButtonsOn[2].mousePressed(toggleSequencerButton2)
  sequencerButtonsOn[3].mousePressed(toggleSequencerButton3)
  
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

function queueNextDrumLoop(selections) {
  let s = selections.sort()
  let t = s.toString()
  let u = t.replace(/,/g, "")
  if (currentSequence < 0) {
    // initialize the first loop
    currentSequence = sequencerIDs.findIndex(u)
    nextSequence = currentSequence
    sequencerGains[currentSequence] = 1
  } else {
    nextSequence = sequencerIDs.findIndex(u)
  }
}

function toggleSequencerButtons(i) {
  isSelected[i] = !isSelected[i]
  if (isSelected[i]) {
    // sequencerSelections.push(i)
    // queueNextDrumLoop(sequencerSelections)
  } else {
    // sequencerSelections.pop(i)
    /* if (sequencerSelections.length == 0) {
      sequencerOn = false
    } else {
      sequencerOn = true
      // queueNextDrumLoop(sequencerSelections)
    } */
  }
  console.log(isSelected)
}

function toggleSequencerButton0() {
  isSelected[0] = !isSelected[0]
}

function toggleSequencerButton1() {
  isSelected[1] = !isSelected[1]
}

function toggleSequencerButton2() {
  isSelected[2] = !isSelected[2]
}

function toggleSequencerButton3() {
  isSelected[3] = !isSelected[3]
}


function pointBetweenPoints(p1, p2, perc) {
  return {
    x: p1.x + perc * (p2.x - p1.x),
    y: p1.y + perc * (p2.y - p1.y),
  }
}



