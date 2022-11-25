import * as d3 from "d3";
import { DefaultArcObject } from "d3";
export class Circle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  el: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  right: number;
  bottom: number;
  start: Date;
  arcPath: d3.Arc<any, d3.DefaultArcObject>;
  maxTime: number;

  static list: Circle[];

  constructor(
    x: number,
    y: number,
    color: string,
    el: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    right: number,
    bottom: number
  ) {
    while (Circle.list.length >= 100) Circle.list.shift();

    this.start = new Date();
    this.maxTime = 10000;
    let angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
    this.right = right;
    this.bottom = bottom;
    this.r = 16;
    if (x < this.r) x = this.r;
    else if (x > this.right - this.r) x = this.right - this.r;
    if (y < this.r) y = this.r;
    else if (y > this.bottom - this.r) y = this.bottom - this.r;
    this.x = x;
    this.y = y;

    el.append("circle")
      .attr("r", 16)
      .attr("stroke-width", 2)
      .attr("stroke", color)
      .attr("fill", "none");
    this.arcPath = d3.arc().innerRadius(0).outerRadius(10);
    el.append("path")
      .attr("d", this.arcPath(<DefaultArcObject>{ startAngle: 0, endAngle: 0 }))
      .attr("fill", color);
    this.el = el;

    Circle.list.push(this);
  }

  update() {
    let time = new Date().valueOf() - this.start.valueOf();
    if (time >= this.maxTime) {
      this.el.remove();
      Circle.list = Circle.list.filter((item) => item != this);
      return;
    }
    if (this.x > this.right - this.r || this.x < this.r) {
      this.dx = -this.dx;
    }
    if (this.y > this.bottom - this.r || this.y < this.r) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.el.attr("transform", `translate(${this.x},${this.y})`);

    let endAngle = (time / this.maxTime) * (Math.PI * 2);
    this.el
      .select("path")
      .attr(
        "d",
        this.arcPath(<DefaultArcObject>{ startAngle: 0, endAngle: endAngle })
      );
  }
}
