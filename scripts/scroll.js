// scroll.js

function Scroll(numRegions) {
  this.max = 200
  this.min = 0
  this.value = 0
  this.speed = 1.25
  this.positive = true
  this.threshold = this.speed * 2
  this.lastDelta = 0
  this.deltaMax = 400

  // distance to next region
  this.distance = 40000
  this.position = this.distance / 2
  this.region = 0

  this.scrollZoom = function(delta) {
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
    this.regionCheck()
  }
}


