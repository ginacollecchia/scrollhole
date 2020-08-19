function setup() {
  createCanvas(windowWidth, windowHeight);

  bgCol = color(207, 236, 207); // minty
  background(bgCol);
  textSize(22);
  
  // WORMHOLE BACKGROUND
  // draw concentric black and white circles
  let diameter = windowWidth + 100;
  let thickness = 60;
  var i;
  for (i = ceil(windowWidth / thickness) + 1; i >= 0; --i) {
    strokeWeight(thickness);
    stroke(255 + 255*Math.pow(-1,i)); // alternate color between black and white
    noFill();
    // start with smallest ellipse
    circle(windowWidth / 2, windowHeight / 2, diameter - i*thickness); 
    console.log(diameter - i*thickness);   
  }
  
}

function draw() {
  
  
}