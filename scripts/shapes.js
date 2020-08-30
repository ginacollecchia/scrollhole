// shapes.js

function Circle(i, g, maxDist) {
  let index = i

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.visible = false
  this.ready = false
  this.color = 'black'
  this.maxWeight = 60
  this.diameter = 0

  this.weight = 0
  this.x = 0
  this.y = 0

  let wobble = { x: 0.0, y:0.0 }

  this.update = function(w) {
    wobble = w
  }

  this.clicked = function() {
    let d = dist(mouseX, mouseY, this.x, this.y)

    if (d > this.diameter * 0.5 - this.weight * 0.5 &&
      d < this.diameter * 0.5 + this.weight* 0.5) {
      this.color = 'red'
    }
  }

  this.draw = function(pos, sinPos, center, scaledCenter) {
    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)

    if (localPos < 0.0) {
      localPos += 1.0
    }

    noFill()
    this.weight = localPos ** 2.5 * this.maxWeight * localPos + 10 * sinPos
    strokeWeight(this.weight)
    stroke(this.color)

    this.diameter = localPos ** 2.5 * maxDist + this.maxWeight * localPos

    let curve = Math.sin(localPos * PI)
    this.x = center.x + curve * width * scaledCenter.x + wobble.x
    this.y = center.y + curve * height * scaledCenter.y + wobble.y,

    circle(this.x, this.y, this.diameter)
  }
}

function Polygon(i, g, maxDist) {
  let index = i

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.visible = false
  this.ready = false
  this.color = 'red'
  this.maxWeight = 100

  this.draw = function(pos, center) {
    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)

    if (localPos < 0.0) {
      localPos += 1.0
    }

    push()
    noFill()
    strokeWeight(localPos ** 2.5 * this.maxWeight)
    stroke(this.color)
    translate(width * 0.5, height * 0.5)
    if (i % 2 == 0) {
      rotate(frameCount / 60.0)
    } else {
      rotate(-frameCount / 60.0)
    }
    polygon(0, 0, localPos ** 5 * maxDist + this.maxWeight * localPos, 7)
    pop()

    return localPos > 1.0
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function Arcs() {
  let index = i

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.visible = false
  this.ready = false
  this.color = 'red'
  this.maxWeight = 100

  this.diameter = 0

  this.weight = 0
  this.x = 0
  this.y = 0

  let wobble = { x: 0.0, y:0.0 }

  this.update = function(w) {
    wobble = w
  }

  this.clicked = function() {
  }

  this.draw = function(pos, sinPos, center, scaledCenter) {
    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)

    if (localPos < 0.0) {
      localPos += 1.0
    }

    noFill()
    this.weight = localPos ** 2.5 * this.maxWeight * localPos + 10 * sinPos
    strokeWeight(this.weight)
    stroke(this.color)

    arc(0, width

    )
  }
}
