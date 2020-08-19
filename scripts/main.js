function setup() {
  createCanvas(windowWidth, windowHeight);

  bgCol = color(207, 236, 207); // minty
  background(bgCol);
  textSize(22);
  
}

function mouseMoved() {
  
  // WORMHOLE BACKGROUND
  // draw concentric black and white circles
  let diameter = windowWidth + 100;
  let thickness = 60;
  var i;
  let numCircles = ceil(windowWidth / thickness) + 1;
  for (i = numCircles; i >= -1; i--) {
    strokeWeight(thickness);
    stroke(255 + 255*Math.pow(-1,i)); // alternate color between black and white
    noFill();
    // start with smallest ellipse. center relative to mouse position and center of screen. outermost circle should be the same every time regardless of mouse position.
    // circle(windowWidth / 2, windowHeight / 2, diameter - i*thickness); 
    circle((mouseX * i/numCircles + windowWidth/2 * (numCircles - i)/numCircles), (mouseY * i/numCircles + windowHeight/2 * (numCircles - i)/numCircles), diameter - i*thickness);
    // console.log(diameter - i*thickness);   
  }
  
  return false;
}

