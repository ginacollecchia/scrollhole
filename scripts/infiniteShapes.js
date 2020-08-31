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
  this.regionPos = 0.0

  this.draw = function(center, scaledCenter, region, nextRegion, inTransition, regionGain, nextRegionGain) {
    shapes.forEach(shape => {
      shape.update(wobble)

      let sinPos = sin(this.regionPos * PI)
      if (shape.region == region) {
        sinPos = 0.0
      }

      const check = shape.draw(pos, sinPos, center, scaledCenter)

      if (check && !inTransition) {
        if(shape.type == 'polygon' && region == 2) {
          shape.updateSides(this.regionPos)
        }
        this.confirmShape(shape, region)
      }

      if (check && inTransition) {
        this.checkShapes(shape, region, nextRegion, regionGain, nextRegionGain)
      }
    })
  }

  this.confirmShape = function(shape, region) {
    let props = {
      i: shape.i,
      g: shape.g,
      maxDist: shape.maxDist,
    }

    if (region == 0 && shape.type !== 'circle') {
      shapes[props.i] = new Circle(props.i, props.g, props.maxDist)
    }
    if (region == 1 && shape.type !== 'arcs') {
      shapes[props.i] = new Arcs(props.i, props.g, props.maxDist)
    }
    if (region == 2 && shape.type !== 'polygon') {
      shapes[props.i] = new Polygon(props.i, props.g, props.maxDist, this.regionPos)
    }
  }

  this.checkShapes = function(shape, region, nextRegion, regionGain, nextRegionGain) {
    const state = Math.round(Math.random())

    let props = {
      i: shape.i,
      g: shape.g,
      maxDist: shape.maxDist,
    }

    if (state == 1) {
      if (nextRegion == 0) {
        shapes[props.i] = new Circle(props.i, props.g, props.maxDist)
      }
      if (nextRegion == 1) {
        shapes[props.i] = new Arcs(props.i, props.g, props.maxDist)
      }
      if (nextRegion == 2) {
        shapes[props.i] = new Polygon(props.i, props.g, props.maxDist, this.regionPos * -1.0 + 1.0)
      }
    }
  }

  this.clicked = function() {
    shapes.forEach(shape => {
      if (shape.visible == true && !shape.clicked()) {
        shape.clicked()
      }
    })
  }

  this.update = function(regionPos, index) {
    this.regionPos = regionPos
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
}

