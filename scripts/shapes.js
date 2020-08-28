// shapes.js

function Circle(i, g, maxDist) {
  let index = i

  this.origin = (1.0 / g) * i + 1.0 / g * 0.5
  this.visible = false
  this.ready = false
  this.color = 'black'
  this.maxWeight = 60

  let wobble = { x: 0.0, y:0.0 }

  this.update = function(w) {
    wobble = w
  }

  this.draw = function(pos, center, scaledCenter) {
    let localPos = map(pos, this.origin, this.origin + 1.0, 0.0, 1.0)

    if (localPos < 0.0) {
      localPos += 1.0
    }

    noFill()
    strokeWeight(localPos ** 2.5 * this.maxWeight * localPos)
    stroke(this.color)

    let curve = Math.sin(localPos * PI)

    circle(
      center.x + curve * width * scaledCenter.x + wobble.x,
      center.y + curve * height * scaledCenter.y + wobble.y,
      localPos ** 2.5 * maxDist + this.maxWeight * localPos
    )
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
