// infiniteShapes.js

function InfiniteShapes() {
  let maxDist = dist(0, 0, width, height)

  let zoomSpeed = 0.0

  let pos = 0.00
  let dir = 0.05

  let group = 4
  let shapes = []

  this.drawShapes = function(center) {
    shapes.forEach(shape => {
      if (shape.visible == true) {
        let localPos = map(pos, shape.origin, shape.origin + 1.0, 0.0, 1.0)

        if (localPos < 0.0) {
          localPos += 1.0
        }

        noFill()
        strokeWeight(localPos**2.5 * shape.maxWeight)
        stroke(shape.color)
        circle(center.x, center.y, localPos**2.5 * maxDist + shape.maxWeight)
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

    pos += dir

    if (pos > 1.0) {
      pos -= 1.0
    }
  }

  // this will respond to the mouse actions
  this.updatePosition = function(p) {
  }

  this.updateGroup = function(g) {
    for (let i = 0; i < g; i++) {
      shapes.push({
        ready: false,
        visible: false,
        color: 'red',
        origin: (1.0 / g) * i + 1.0 / g * 0.5,
        maxWeight: 100,
        index: i,
      })
    }
  }

  // put this in the draw loop
  this.draw = function(center) {
    this.drawShapes(center)
  }
}

