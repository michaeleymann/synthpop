let synthesizers = []

function setup() {
  createCanvas(windowWidth,windowHeight);
  strokeWeight(2)

  // Phänomene generieren, in Raster positioniert.
  for (let i = 0; i < windowWidth; i += synthSize) {
    for (let j = 0; j < windowHeight; j += synthSize) {
      synthesizers.push(new Synthesizer(i, j, synthSize))
    }
  }
  // Sollen die Phänomene in einem Raster stehen?
  // Bewegen sich die Phänomene?
}

function draw() {
  background(255)
  for (let synth of synthesizers) {
    synth.show()
  }
}