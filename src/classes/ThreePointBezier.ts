import { coordinate, tpb } from "../lib";
import { CanvasElement } from "./CanvasElement";

export class ThreePointBezier extends CanvasElement{
    p1: coordinate;
    p2: coordinate;
    p3: coordinate;
    interval: number;
    context: CanvasRenderingContext2D;
	w: number;
	h: number;
	color: string
	constructor(
		context: CanvasRenderingContext2D, 
		x: number, 
        y: number, 
		w: number, 
		h: number,
		p1: coordinate, 
		p2: coordinate, 
		p3: coordinate
		) {
		super(context, x, y)
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.w = w;
		this.h = h;
		this.interval = 0.02;
        this.context = context
	}

	drawDot(x: number, y: number) {
		this.context.fillRect(x, y, 2, 2);
	}

	translate() {}

	draw() {
        var {p1, p2, p3, context} = this
		context.fillStyle = this.color;
		var barwidth = 2
		for (var t = 0; t <= 1; t += this.interval) {
			var bx = tpb(t, p1, p2, p3, "x");
			var by = tpb(t, p1, p2, p3, "y");
			//this.drawDot(bx, by);
			context.fillRect(bx+barwidth, by, barwidth, this.y+this.h - by);
		}
	}

	change(p1: coordinate, p2: coordinate, p3: coordinate) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}

	mouseUp() {}
	mouseMove(x: number, y:number) {}

	setColor(color: string){
		this.color = color
	}
}