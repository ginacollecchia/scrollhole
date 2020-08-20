function setup() {
  createCanvas(windowWidth, windowHeight);

  bgCol = color(207, 236, 207); // minty
  background(bgCol);
  textSize(22);

}

function mouseWheel(event) {
  print(event.delta);
  console.log(event.delta)
  //move the square according to the vertical scroll amount
  pos += event.delta;
  //uncomment to block page scrolling
  //return false;
}

function mouseMoved() {

  // WORMHOLE BACKGROUND
  let diameter = windowWidth + 100;
  let thickness = 60;
  var i;
  let numCircles = ceil(windowWidth / thickness) + 1;
  // draw concentric black and white circles in background
  for (i = numCircles; i >= -1; i--) {
    strokeWeight(thickness);
    stroke(255 + 255*Math.pow(-1,i)); // alternate color between black and white
    stroke(255, 0, 0); // alternate color between black and white
    noFill();
    // start with smallest circle. center relative to mouse position and center of screen. outermost circle should be the same every time regardless of mouse position.
    // circle(windowWidth / 2, windowHeight / 2, diameter - i*thickness);
    circle((mouseX * i/numCircles + windowWidth/2 * (numCircles - i)/numCircles), (mouseY * i/numCircles + windowHeight/2 * (numCircles - i)/numCircles), diameter - i*thickness);
    // console.log(diameter - i*thickness);
  }

  // draw "path" of circles leading up to center circle
  // let arcDiameter = windowHeight/2;
  let numArcs = floor(numCircles/2) + 1;
  for (i = 0; i < numCircles; i++) {
    strokeWeight(thickness);
    stroke(255 + 255*Math.pow(-1,i)); // alternate color between black and white
    noFill();
    arc((mouseX * (numCircles - i)/numCircles + windowWidth/2 * i/numCircles), (i+2)*thickness + (mouseY * (numCircles - i)/numCircles + windowHeight/2 * i/numCircles), (i+3)*thickness, (i+3)*thickness, -PI, PI);
  }

  return false;
}

