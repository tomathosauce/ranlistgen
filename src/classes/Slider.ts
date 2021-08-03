import { coordinate, subtract } from "../lib";
import { CanvasElement } from "./CanvasElement";
import { Circle } from "./Circle";

export class Slider extends CanvasElement{
    l: number;
    o: string;
    t: number;
    circle: Circle;
	active: boolean;
	activeColor = "red"
	unActiveColor = "blue"
	constructor(context: CanvasRenderingContext2D, 
        x: number, y: number, length: number, orientation: "v"|"h", t: number=10) {
        super(
			context, x,y)
			//orientation == "v" ? x + t/2 : x, 
			//orientation == "v" ? y: y + t/2)
		this.l = length;
		this.o = orientation;
		this.t = t;
		this.circle = new Circle(context, this.x, this.y, this.t*2);
	}
	draw() {
        var {context} = this
		context.fillStyle = "black";

		if(this.active){
			this.circle.setColor(this.activeColor)
		} else {
			this.circle.setColor(this.unActiveColor)
		}

		if ((this.o = "v")) {
			//context.fillRect(this.x, this.y, this.t, this.l);
			this.circle.draw();
		} else {
			//context.fillRect(this.x, this.y, this.l, this.t);
			this.circle.draw();
		}
	}

	move(dx: number, dy: number) {
		if ((this.o = "v")) {
			var ch = this.circle.y + dy;
			if (this.y < ch && ch < this.y + this.l) {
				this.circle.move(0, dy);
			} else if (this.y < ch) {
				this.circle.change(this.circle.x, this.y + this.l);
			} else if (this.y > ch) {
				this.circle.change(this.circle.x, this.y);
			}
			console.log(this.y, this.circle.y + dy, this.y + this.l);
		} else {
			this.circle.move(dx, 0);
		}
	}
	correct() {
		if (this.y + this.l < this.circle.y) {
			this.circle.change(this.circle.x, this.y + this.l);
		} else if (this.y > this.circle.y) {
			this.circle.change(this.circle.x, this.y);
		}
		console.log(this.y, this.circle.y, this.y + this.l);
	}

	mouseDown(x: number, y: number){
		if(this.circle.inside(x, y)){
			this.active = true
		}
		this.draw()
	}

	mouseMove(x: number, y: number, lastPos: coordinate) {
		if(this.active){//if (this.circle.inside(x, y)) {
			var { x: dx, y: dy } = subtract({ x, y }, lastPos);
			this.move(dx, dy);
			this.draw();
			
		} 
	}

	mouseUp(x?: number, y?: number) {
		this.correct();
		this.active = false
		this.draw();
		
	}

	setColor(active: string, unactive: string){
		this.activeColor=active
		this.unActiveColor = unactive
	}
}