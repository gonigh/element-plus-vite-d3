import * as d3 from "d3";
export class Circle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  el: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  right: number;
  bottom: number;
  constructor(
    x: number,
    y: number,
    r: number,
    el: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>,
    right: number,
    bottom: number
  ) {
    this.x = x;
    this.y = y;
    this.r = r;
    let angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
    
    this.el = el;
    this.right = right;
    this.bottom = bottom;
  }

  update() {
    if (this.x > -this.right || this.x < this.r) {
      this.dx = -this.dx;
    }
    if (this.y > this.bottom - this.r || this.y < this.r) {
      this.dy = -this.dy;
    }
    console.log(this.x,this.y,this.dx,this.dy);
    this.x += this.dx;
    this.y += this.dy;
    this.el.attr("cx", this.x).attr("cy", this.y);
  }
}
