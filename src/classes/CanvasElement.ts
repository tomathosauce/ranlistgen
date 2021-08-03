import { coordinate } from "../lib";

export class CanvasElement {
	mouseUp(x?: number, y?: number) {
		throw new Error("Method not implemented.");
	}
	draw() {
		throw new Error("Method not implemented.");
	}
	mouseMove(x: number, y: number, lastPos: coordinate) {
		throw new Error("Method not implemented.");
	}
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    active: boolean = false
    constructor(
        context: CanvasRenderingContext2D, 
        x: number, 
        y: number
    ){
        this.context = context
        this.x = x;
		this.y = y;
    }
}