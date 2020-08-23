// infiniteShapes.js

function InfiniteShapes() {
  let maxDist = dist(0, 0, width, height)

  let pos = 0.00
  let dir = 0.003
  let scrollSpeed = 0.0

  let shapes = []

  this.drawShapes = function(center) {
    shapes.forEach(shape => {
      if (shape.visible == true) {
        shape.draw(pos, center)
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

    if (scrollSpeed > 0.03) {
      scrollSpeed = 0.03
    }
    if (scrollSpeed < -0.03) {
      scrollSpeed = -0.03
    }

    pos += dir + scrollSpeed

    if (pos > 1.0) {
      pos -= 1.0
    } else if (pos < 0.0) {
      pos += 1.0
    }
  }

  // this will respond to the mouse actions
  this.updatePosition = function(p) {
  }

  this.updateGroup = function(g) {
    for (let i = 0; i < g; i++) {
      shapes.push(
        new Polygon(i, g, maxDist)
      )
    }
  }

  this.scroll = function(s) {
    scrollSpeed = s
  }

  // put this in the draw loop
  this.draw = function(center) {
    this.drawShapes(center)
  }
}

