function setup() {
  createCanvas(windowWidth, windowHeight);

  bgCol = color(207, 236, 207); // minty
  background(bgCol);
  textSize(22);
  
}

function draw() {
  // WORMHOLE BACKGROUND
  // draw concentric black and white circles
  // ellipse(centerX, centerY, width, height)

  let diameter = windowWidth + 100;
  let thickness = 60;
  var i;
  for (i = 0; i < ceil(windowWidth / thickness); i++) {
    strokeWeight(thickness);
    stroke(255 + 255*Math.pow(-1,i)); // alternate color between black and white
    // start with smallest ellipse
    ellipse(windowWidth / 2, windowHeight / 2, diameter - i*thickness, diameter - i*thickness);    
  }
  
  
}