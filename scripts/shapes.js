// shapes.js

function checkEnding(localPos, lastPos) {
  if (lastPos > 0.9 && localPos < 0.1) {
    return true
  }
  if (localPos > 0.9 && lastPos < 0.1) {
    return true
  }
  return false
}

function Circle(i, g, maxDist) {
  let index = i

  colorMode(HSB, 109, 88, 99) // lime green is most saturated hue

  this.i = i
  this.g = g
  this.maxDist = maxDist
  this.type = 'circle'
  this.region = 0
  this.alpha = 0.0

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.color = 'black'
  this.hue = 40
  this.maxWeight = 70
  this.diameter = 0
  let lastPos = 0.0

  this.weight = 0
  this.x = 0
  this.y = 0

  let wobble = { x: 0.0, y:0.0 }
  let wobbleInc = 0.0

  this.update = function(w) {
    wobble = w
  }

  this.clicked = function() {
    let d = dist(mouseX, mouseY, this.x, this.y)

    if (d > this.diameter * 0.5 - this.weight * 0.5 &&
      d < this.diameter * 0.5 + this.weight * 0.5) {
        // change to be a function of diameter: when diameter = windowWidth, color is dark green, when diameter = 0, color is light green
        colorMode(HSB, 360)
        let c = color(random(0, 360), 360, 360)
        this.color = c
      return true
    }
  }

  this.draw = function(pos, sinPos, center, scaledCenter) {
    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)

    if (localPos < 0.0) {
      localPos += 1.0
    }

    wobbleInc += 0.02 * (sinPos * -1.0 + 1.0) * localPos
    let wSin = sin(wobbleInc * 2 * PI) * 30 * localPos
    let wCos = cos(wobbleInc * 2 * PI) * 30 * localPos
    wobbleInc %= 1.0

    noFill()
    this.weight = localPos ** 3 * this.maxWeight * sinPos
    strokeWeight(this.weight)
    stroke(this.color)

    this.diameter = localPos ** 4 * maxDist + this.maxWeight * localPos

    let curve = Math.sin(localPos * PI)
    this.x = center.x + curve * width * scaledCenter.x + wobble.x + wSin
    this.y = center.y + curve * height * scaledCenter.y + wobble.y + wCos

    circle(this.x, this.y, this.diameter)

    let check = checkEnding(localPos, lastPos)
    lastPos = localPos

    return check
  }
}

function Polygon(i, g, maxDist, regionPos) {
  let index = i

  this.i = i
  this.g = g
  this.maxDist = maxDist

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.color = 'black'
  this.hue = 140
  this.maxWeight = 100
  this.type = 'polygon'
  this.region = 2
  this.alpha = 0.0

  let wobble = { x: 0.0, y:0.0 }
  let lastPos = 0.0

  this.update = function(w) {
    wobble = w
  }

  this.updateSides = function(p) {
    this.sides = Math.round(4 + p * p * 10)
  }

  this.draw = function(pos, sinPos, center, scaledCenter) {
    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)
    if (localPos < 0.0) {
      localPos += 1.0
    }

    this.weight = localPos ** 2.5 * this.maxWeight
    let curve = Math.sin(localPos * PI)
    this.x = center.x + curve * width * scaledCenter.x + wobble.x
    this.y = center.y + curve * height * scaledCenter.y + wobble.y
    this.diameter = localPos ** 2.5 * maxDist + this.maxWeight * localPos

    push()
    {
      noFill()
      strokeWeight(this.weight)
      stroke(this.color)
      translate(this.x, this.y)
      if (i % 2 == 0) {
        rotate(frameCount / 60.0)
      } else {
        rotate(-frameCount / 60.0)
      }


      polygon(0, 0, this.diameter, this.sides)
    }
    pop()

    let check = checkEnding(localPos, lastPos)
    lastPos = localPos

    return check
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

function Arcs(i, g, maxDist) {
  let index = i

  this.i = i
  this.g = g
  this.maxDist = maxDist
  this.type = 'arcs'
  this.region = 1

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.color = 'black'
  this.hue = 240
  this.maxWeight = 20
  this.alpha = 0.0

  this.diameter = 0

  this.weight = 0
  this.x = 0
  this.y = 0
  this.halfWidth = width / 2.0
  this.quarterWidth = width / 4.0
  this.halfHeight = height /  2.0
  this.quarterHeight = height /  4.0
  this.heightThird = height / 3.0
  this.widthThird = width / 3.0
  let wobble = { x: 0.0, y:0.0 }
  let wobbleInc = 0.0

  let lastPos = 0.0

  this.update = function(w) {
    wobble = w
  }

  this.clicked = function() {
  }

  this.draw = function(pos, regionPos, center, scaledCenter) {
    regionPos = regionPos * -1.0 + 1.0
    let flatten = regionPos
    flatten *= scaledCenter.y

    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)

    if (localPos < 0.0) {
      localPos += 1.0
    }

    let revPos = localPos * -1.0 + 1.0

    wobbleInc += 0.01 * localPos
    let wSin = sin(wobbleInc * PI)

    noFill()
    this.weight = revPos ** 2 * this.maxWeight
    strokeWeight(this.weight)
    stroke(this.color)

    let edgeHeight = this.halfHeight * localPos
    let sideArcHeight = edgeHeight * 4
    let bottomEdgeHeight = this.halfHeight + this.halfHeight * revPos
    let offset = this.weight
    let halfRegionPos = regionPos * 0.5

    localPos = sqrt(localPos)
    revPos = localPos * -1.0 + 1.0
    let widthOffset = scaledCenter.x * this.halfWidth * 0.5 + wSin * 20

    arc(
      widthOffset, edgeHeight - offset,
      this.halfWidth + this.halfWidth * revPos, sideArcHeight * flatten,
      0, PI
    )
    arc(
      this.halfWidth + widthOffset, edgeHeight - offset,
      this.halfWidth * localPos, this.quarterHeight * localPos * flatten,
      PI, PI * 2
    )
    arc(
      width + widthOffset, edgeHeight - offset,
      this.halfWidth + this.halfWidth * revPos, sideArcHeight * flatten,
      0, PI
    )

    arc(
      0 + widthOffset, bottomEdgeHeight + offset,
      this.halfWidth + this.halfWidth * revPos, sideArcHeight * flatten,
      PI, PI * 2
    )
    arc(
      this.halfWidth + widthOffset, bottomEdgeHeight + offset,
      this.halfWidth * localPos, this.quarterHeight * localPos * flatten,
      0, PI
    )
    arc(
      width + widthOffset, bottomEdgeHeight + offset,
      this.halfWidth + this.halfWidth * revPos, sideArcHeight * flatten,
      PI, PI * 2,
    )

    let check = checkEnding(localPos, lastPos)
    lastPos = localPos

    return check
  }
}
