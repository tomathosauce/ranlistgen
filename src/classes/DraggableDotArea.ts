import { coordinate, subtract } from "../lib";
import { CanvasElement } from "./CanvasElement";
import { Circle } from "./Circle";

export class DraggableDotArea extends CanvasElement{
    canvas: HTMLCanvasElement;
    w: number;
    h: number;
    circle: Circle;
	activeColor = "red"
	unActiveColor = "blue"
	constructor(
		context: CanvasRenderingContext2D, 
		canvas: HTMLCanvasElement,
        x: number, 
        y: number, 
		w: number, 
		h: number) {
			
        super(context, x, y)
        this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.circle = new Circle(context, x+w/2+1,y+h/2, 20);
	}

	draw() {
        var {canvas, context} = this
		//context.fillStyle = "grey";
		//context.fillRect(this.x, this.y, this.w, this.h);

		if(this.active){
			this.circle.setColor(this.activeColor)
		} else {
			this.circle.setColor(this.unActiveColor)
		}

		this.circle.draw();
		/*context.fillText(
			`x: ${this.circle.x}, y: ${canvas.height - this.circle.y}`,
			this.circle.x + 10,
			this.circle.y
		);*/
	}

	mouseDown(x: number, y: number){
		if(this.circle.inside(x, y)){
			this.active = true
		}
		this.draw()
	}

	move(dx: number, dy: number) {
		var chy = this.circle.y + dy;
		var chx = this.circle.x + dx;
		if (this.y < chy && chy < this.y + this.h) {
			this.circle.move(0, dy);
		}
		if (this.x < chx && chx < this.x + this.w) {
			this.circle.move(dx, 0);
		}
	}

	mouseMove(x: number, y: number, lastPos: coordinate) {
		if(this.active){//if (this.circle.inside(x, y)) {
			var { x: dx, y: dy } = subtract({ x, y }, lastPos);
			this.move(dx, dy);
			this.draw();
		}
	}

	mouseUp(x?: number, y?: number) {
		this.active = false
		this.draw()
	}

	setColor(active: string, unactive: string){
		this.activeColor=active
		this.unActiveColor = unactive
	}
}