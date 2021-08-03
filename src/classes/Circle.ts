import { CanvasElement } from "./CanvasElement";
import { sq, sqr } from "../lib";

export class Circle extends CanvasElement{
    r: number;
    isDragging: boolean;
    color: string;
	constructor(context: CanvasRenderingContext2D, x: number, y: number, r: number) {
        super(context, x, y)
		this.r = r;
		this.isDragging = false;
		this.color = "red";
	}

	inside(x: number, y: number, dx = 0, dy = 0) {
		return sqr(sq(this.x - x + dx) + sq(this.y - y + dy)) <= this.r;
	}

	draw(x?: number, y?: number) {
        var {context} = this
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	}

	change(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	move(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
	}

	setColor(color: string){
		this.color = color
	}
}
