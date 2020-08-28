// shapes.js

function Circle(i, g, maxDist) {
  let index = i

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.visible = false
  this.ready = false
  this.color = 'black'
  this.maxWeight = 60

  let centerXOffset = 0
  let centerYOffset = 0
  let wobble = 0.0
  let wobbleSpeed = 0.01

  this.draw = function(pos, center) {
    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)

    if (localPos < 0.0) {
      localPos += 1.0
    }

    noFill()
    strokeWeight(localPos ** 2.5 * this.maxWeight * localPos)
    stroke(this.color)

    let scaledX = (mouseX - width * 0.5) / (width * 2.0)
    let scaledY = (mouseY - height * 0.5) / (height * 2.0)

    wobble = (wobble + wobbleSpeed) % 1.0
    centerXOffset = sin(wobble * 2 * PI) * 5 * localPos
    centerYOffset = cos(wobble * 2 * PI) * 5 * localPos

    circle(
      center.x + Math.sin(localPos * PI) * width * scaledX + centerXOffset,
      center.y + Math.sin(localPos * PI) * height * scaledY + centerYOffset,
      localPos ** 2.5 * maxDist + this.maxWeight * localPos
    )

    return localPos > 1.0
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

function Triangle() {

}
