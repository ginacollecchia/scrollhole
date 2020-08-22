// infiniteShapes.js

function InfiniteShapes() {
  let maxDist = dist(0, 0, width, height)

  let zoomSpeed = 0.0

  let pos = 0.00
  let dir = 0.001

  let group = 4
  let shapes = []

  this.drawShapes = function(center) {
    shapes.forEach(shape => {
      if (shape.visible == true) {
        strokeWeight(pos * shape.maxWeight)
        stroke(shape.color)
        circle(center.x, center.y, pos * maxDist + shape.maxWeight)
      }
    })
  }

  this.update = function() {
    let groupPosition = 1.0 / group

    shapes.forEach(shape => {
      if (pos < shape.origin) {
        shape.ready = true
      }
      if (pos > shape.origin && shape.reset == true) {
        shape.visible == true
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
        origin: i / 1.0,
        maxWeight: i / 1.0,
      })
    }
  }

  this.updateGroup(4);

  console.log(shapes)

  // put this in the draw loop
  this.draw = function(center) {
    this.drawShapes(center)
  }
}

