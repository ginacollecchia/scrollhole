// infiniteShapes.js

function InfiniteShapes() {
  let maxDist = dist(0, 0, width, height)

  let pos = 0.00
  let dir = 0.00
  let scrollSpeed = 0.0

  let shapes = []

  let wobbleScalar = 0.0
  let wobbleSpeed = 0.01
  let wobble = { x: 0.0, y: 0.0 }

  this.drawShapes = function(center, scaledCenter) {
    shapes.forEach(shape => {
      if (shape.visible == true) {
        shape.update(wobble)
        shape.draw(pos, center, scaledCenter)
      }
    })
  }

  this.update = function() {
    shapes.forEach(shape => {
      if (pos < shape.origin && shape.ready == false) {
        shape.ready = true
      }
      if (pos > shape.origin && shape.ready == true && shape.visible == false) {
        shape.visible = true
      }
    })

    pos += dir + scrollSpeed

    if (pos > 1.0) {
      pos -= 1.0
    } else if (pos < 0.0) {
      pos += 1.0
    }

    wobbleScalar = (wobbleScalar + wobbleSpeed) % 1.0

    wobble.x = Math.sin(wobbleScalar * 2 * PI)
    wobble.y = Math.cos(wobbleScalar * 2 * PI)
  }

  this.updateGroup = function(g) {
    for (let i = 0; i < g; i++) {
      shapes.push(
        new Circle(i, g, maxDist)
      )
    }
  }

  this.scroll = function(s) {
    scrollSpeed = s
  }

  // put this in the draw loop
  this.draw = function(center, scaledCenter) {
    this.drawShapes(center, scaledCenter)
  }
}

