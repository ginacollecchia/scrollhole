// scroll.js

function Scroll(numRegions) {
  this.max = 0
  this.min = 0
  this.value = 0
  this.speed = 1.5
  this.positive = false
  this.threshold = this.speed * 2
  this.position = 0
  this.lastDelta = 0
  this.deltaMax = 500

  // distance to next region
  this.distance = 20000

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


