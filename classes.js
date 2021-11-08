let synthSize = 200;

let rectSize = synthSize / 20;
let faderSize = synthSize/20;
let border = synthSize/20;
let minCD = 500;
let maxCD = 1000;
let blackKeys = [0,1,3,4,5,7,8,10,11,12];
let colors = ["#B7094C","#892B64","#5C4D7D","#2E6F95","#0091AD"];

class Synthesizer { //
  constructor(posX, posY, size) {
    this.pos = {x: posX + border, y: posY + 2*border};
    this.size = {x: size - 2*border, y: size - 4*border};
    this.color = random(colors);
    this.numAreas = round(random(2,5));
    this.hasKeys = random() < 0.6 ? true : false;
    this.numKeys = round(random(7,15));
    this.keySize = (this.size.y + border) / this.numKeys;
    this.areas = [];
    this.areaSize = {x: this.size.x/this.numAreas, y:  this.size.y / 2};
    for (let i = 0; i < this.size.x; i += this.areaSize.x) {
      this.areas.push(new Area(i, 0, this.areaSize.x, this.areaSize.y, this.color));
      if (!this.hasKeys) {
        this.areas.push(new Area(i, this.size.y / 2, this.areaSize.x, this.areaSize.y, this.color));
      }
    }
  }
  show() {
    // Umrandung Zeichnen
    noFill();
    stroke(this.color)
    rect(
      this.pos.x - border/4, this.pos.y - border/4, 
      this.size.x + border/2, this.size.y + border/2, 10
      );

    //Tasten Zeichnen  
    if (this.hasKeys){
      noFill();
      for (let i = 0; i < this.numKeys; i++) {
        rect(
          this.pos.x + border/2 + i*this.keySize,
          this.pos.y + this.size.y/2 + border/2,
          this.keySize,this.size.y/2 - border/4
          )
        if (blackKeys.includes(i) && i < this.numKeys - 1){
          fill(this.color);
          rect(
            this.pos.x + border/2 + (i+0.5)*this.keySize + this.keySize*0.25,
            this.pos.y + this.size.y/2 + border/2,
            this.keySize * 0.5, this.size.y/2 - 2*border
          )
          noFill();

        }

      }
    }
    // Areas zeichnen
    push();
    translate(this.pos.x, this.pos.y);
    for (let area of this.areas) {
      area.show();
    }
    pop();
  }
}

class Area {
  constructor(posX, posY, sizeX, sizeY, color) {
    this.pos = {x: posX, y: posY};
    this.size = {x: sizeX, y: sizeY };
    this.color = color;
    this.type = round(random(1,3))
    this.numControllers = round(random(1,3));
    this.controllerSize = {
      x: this.size.x / this.numControllers,
      y: this.size.y / this.numControllers
    }
    this.controllers = [];
    for (let i = 0; i < this.numControllers; i++) {
      for (let j = 0; j < this.numControllers; j++) {
        let x = i * this.controllerSize.x + this.size.x / this.numControllers / 2
        let y = j * this.controllerSize.y + this.size.y / this.numControllers / 2
        this.controllers.push(new Controller(x, y, this.controllerSize.x, this.color, this.type, random(-1,1)))
      }
    }

  }
  show() {
    noFill();
    // Controller zeichnen
    push();
    translate(this.pos.x, this.pos.y);
    for (let controller of this.controllers) {
      controller.show();
      controller.updatePosition();
    }
    pop();
  }
}

class Controller {
  constructor(posX, posY, size, color, type, value) {
    this.pos = {x: posX, y: posY};
    this.size = size/2;
    this.type = type;
    this.color = color;
    this.value = value; // value geht von -1 bis 1
    this.paused = random() < 0.9 ? true: false;
    this.speed = random(-0.02,.02);
    this.countdown = random (100,maxCD);
  }
  show() {
    if (this.type == 1) {
      // KNOBS
      let knobPos = this.value * TAU;
      ellipseMode(CENTER)
      ellipse(this.pos.x, this.pos.y, this.size, this.size) 
      line(
        this.pos.x, this.pos.y,
        this.pos.x + cos(knobPos)*this.size/2,
        this.pos.y + sin(knobPos)*this.size/2
        )
    } else if (this.type == 2) { 
      // BUTTONS
      rectMode(CENTER)
      rect(this.pos.x, this.pos.y, rectSize, rectSize, rectSize/4) 
    } else {
      // FADERS
      let faderPos = this.pos.y + this.value*faderSize;
      line(
        this.pos.x, this.pos.y - faderSize,
        this.pos.x, this.pos.y + faderSize
        )
      fill(this.color)
      rect(
        this.pos.x-faderSize/4, faderPos, 
        faderSize/2, faderSize/3)
    }

  }
  updatePosition(){
    if (this.countdown < 0){
      this.paused = !this.paused;
      this.countdown = random (minCD,maxCD);
    }
    if (!this.paused){
      this.move()
      this.countdown -= 4;
    }
    this.countdown -= 1;
  }
  move(){
    if (this.value > 1 || this.value < -1){
      this.speed = -this.speed;
    }
    this.value += this.speed;
    if (random() < 0.001) {
      this.speed = -this.speed;
    }
  }
}