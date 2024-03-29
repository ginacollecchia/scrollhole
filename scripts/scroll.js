// scroll.js

function Scroll(numRegions) {
  this.max = 200
  this.min = 0
  this.value = 0
  this.speed = 12
  this.positive = true
  this.threshold = this.speed * 2
  this.lastDelta = 0
  this.deltaMax = 500
  this.inTransition = false

  // distance to next region
  this.distance = 100000
  this.position = this.distance / 2
  this.region = 0
  this.nextRegion = numRegions - 1
  this.regionPosition = 0.0
  this.halfway = this.distance * 0.5
  this.transitionSpace = .10
  this.stopped = false

  this.regionGain = 1.0
  this.nextRegionGain = 0.0
  this.hueScalar = 0.0

  const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))

  let lastDelta = 0

  this.scrollZoom = function(delta) {
    this.stopped = false
    delta *= 8
    if (delta > this.deltaMax) {
      delta = this.deltaMax
    }
    if (delta < -this.deltaMax) {
      delta = -this.deltaMax
    }

    if (delta > this.max) {
      this.max = delta
      this.positive = true
    }
    if (delta < this.min) {
      this.min = delta
      this.positive = false
    }
  }

  this.regionCheck = function() {
    if (this.position > this.distance) {
      this.lastRegion = this.region
      this.region = (this.region + 1) % numRegions
      this.position -= this.distance
    } else if (this.position < 0) {
      this.lastRegion = this.region
      this.region = (((this.region - 1) % numRegions) + numRegions) % numRegions
      this.position += this.distance
    }
  }

  this.halfwayCheck = function() {
    if (this.position > this.halfway) {
      this.nextRegion = (this.region + 1) % numRegions
    } else {
      this.nextRegion = (((this.region - 1) % numRegions) + numRegions) % numRegions
    }
  }

  this.gainCheck = function() {
    if (this.regionPosition >= 1.0 - this.transitionSpace && this.regionPosition < 1.0) {
      let mapped = map(this.regionPosition, 1.0 - this.transitionSpace, 1.0, 1.0, 0.5)
      this.regionGain = mapped
      this.nextRegionGain = this.regionGain * -1.0 + 1.0
      this.inTransition = true
    } else if (this.regionPosition >= 0.0 && this.regionPosition < this.transitionSpace) {
      let mapped = map(this.regionPosition, 0.0, this.transitionSpace, 0.5, 1.0)
      this.regionGain = mapped
      this.nextRegionGain = this.regionGain * -1.0 + 1.0
      this.inTransition = true
    }
    else {
      this.regionGain = 1.0
      this.nextRegionGain = 0.0
      this.inTransition = false
    }
  }

  this.update = function() {
    if (this.positive) {
      this.max -= this.speed
      this.value = this.max

      if (this.value < this.threshold) {
        this.stopped = true
        this.value = 0
      }

      if (this.max < 0) {
        this.max = 0
      }
      this.min = 0
    } else {
      this.min += this.speed
      this.value = this.min

      if (this.value > -this.threshold) {
        this.value = 0
        this.stopped = true
      }

      if (this.min > 0) {
        this.min = 0
      }
      this.max = 0
    }

    this.position += this.value
    this.regionPosition = this.position / this.distance
    if (this.regionPosition > 0.5) {
      this.hueScalar = this.regionPosition - 0.5
    } else {
      this.hueScalar = this.regionPosition * -1.0 + 1.0 - 0.5
    }
    this.regionCheck()
    this.halfwayCheck()
    this.gainCheck()
  }
}


