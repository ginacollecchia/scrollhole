
function RadialBackground(center) {
  this.x = center.x
  this.y = center.y
  
  this.draw = function(center) {
    let mouseXpercentage = Math.round(center.x / windowWidth * 100)
    let mouseYpercentage = Math.round(center.y / windowHeight * 100)
  
    $('.radial-gradient').css('background', 'radial-gradient(at ' + mouseXpercentage + '% ' + mouseYpercentage + '%, #3498db, #9b59b6)')
  }
}