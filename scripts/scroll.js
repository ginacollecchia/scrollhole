// scroll.js

function Scroll(numRegions) {
  this.max = 600
  this.min = 0
  this.value = 0
  this.speed = 5
  this.positive = true
  this.threshold = this.speed * 2
  this.lastDelta = 0
  this.deltaMax = 750

  // distance to next region
  this.distance = 40000
  this.position = this.distance / 2
  this.region = 0
  this.regionPosition = 0.0
  this.gain = 0.0

  const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))

  this.scrollZoom = function(delta) {
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
      this.region = (this.region + 1) % numRegions
      this.position -= this.distance
    } else if (this.position < 0) {
      this.region = (((this.region - 1) % numRegions) + numRegions) % numRegions
      this.position += this.distance
    }
  }

  this.gainCheck = function() {
    this.gain = sin(PI * this.regionPosition)
  }

  this.update = function() {
    if (this.positive) {
      this.max -= this.speed
      this.value = this.max

      if (this.value < this.threshold) {
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
      }

      if (this.min > 0) {
        this.min = 0
      }
      this.max = 0
    }

    this.position += this.value
    this.regionPosition = this.position / this.distance
    this.regionCheck()
    this.gainCheck()
    console.log(this.regionPosition, this.gain)
  }
}


