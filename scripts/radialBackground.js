// radialBackground.js

function RadialBackground(center, inner, outer) {
  this.draw = function(center, inner, outer) {

    let c1 = HSVtoRGB(inner.h/360.0, inner.s/360.0, inner.b/360.0)
    rgba1 = 'rgba(' + c1.r + ', ' + c1.g + ', ' + c1.b + ', 1.0)'

    let c2 = HSVtoRGB(outer.h/360.0, outer.s/360.0, outer.b/360.0)
    rgba2 = 'rgba(' + c2.r + ', ' + c2.g + ', ' + c2.b + ', 1.0)'

    let mouseXpercentage = Math.round(center.x / windowWidth * 100)
    let mouseYpercentage = Math.round(center.y / windowHeight * 100)

    $('.radial-gradient').css('background', 'radial-gradient(at ' + mouseXpercentage + '% ' + mouseYpercentage + '%, ' + rgba1 + ', ' + rgba2 + ')')
  }
}

// from https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
