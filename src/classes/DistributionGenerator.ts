import { atbp, coordinate } from "../lib"
import { CanvasElement } from "./CanvasElement"
import { DraggableDotArea } from "./DraggableDotArea"
import { Slider } from "./Slider"
import { ThreePointBezier } from "./ThreePointBezier"

export class DistributionGenerator extends CanvasElement {
    leftSlider: Slider
    area: DraggableDotArea
    rightSlider: Slider
    w: number;
    h: number;
    canvas: HTMLCanvasElement
    tbp: ThreePointBezier

    circleUnActive="#AA1155"
    circleActive = "#DD1155"
    bezierColor="#00CC99"
    background="white"
    constructor(
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        x: number,
        y: number,
        w: number,
        h: number) {
        super(context, x, y)
        this.w = w
        this.h = h
        this.canvas = canvas
        this.leftSlider = new Slider(context, x, y, h, "v")
        this.area = new DraggableDotArea(context, canvas, x, y, w, h)
        this.rightSlider = new Slider(context, x + w, y, h, "v")

        this.tbp = new ThreePointBezier(
            context,
            x, y, w, h,
            { x: this.leftSlider.circle.x, y: this.leftSlider.circle.y },
            { x: this.area.circle.x, y: this.area.circle.y },
            { x: this.rightSlider.circle.x, y: this.rightSlider.circle.y }
        )


        this.leftSlider.setColor(this.circleActive,this.circleUnActive)
        this.rightSlider.setColor(this.circleActive,this.circleUnActive)
        this.area.setColor(this.circleActive,this.circleUnActive)
        this.tbp.setColor(this.bezierColor)
    }

    draw() {
        var { context } = this
        context.fillStyle = this.background
        context.fillRect(this.x, this.y, this.w, this.h);
        this.tbp.draw()
        this.area.draw()

        this.leftSlider.draw()
        this.rightSlider.draw()
    }

    updateBezier() {
        this.tbp.change(
            { x: this.leftSlider.circle.x, y: this.leftSlider.circle.y },
            { x: this.area.circle.x, y: this.area.circle.y },
            { x: this.rightSlider.circle.x, y: this.rightSlider.circle.y }
        )
    }

    erase() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    mouseDown(x: number, y: number){
        this.leftSlider.mouseDown(x,y)
        this.rightSlider.mouseDown(x,y)
        this.area.mouseDown(x,y)
    }

    mouseMove(x: number, y: number, lastPos: coordinate) {
        this.erase()
        this.leftSlider.mouseMove(x, y, lastPos)
        this.rightSlider.mouseMove(x, y, lastPos)
        this.area.mouseMove(x, y, lastPos)
        this.updateBezier()
        this.draw()
    }

    generateYBezier(x: number) {
        return atbp(
            { x: this.leftSlider.circle.x, y: this.leftSlider.circle.y },
            { x: this.area.circle.x, y: this.area.circle.y },
            { x: this.rightSlider.circle.x, y: this.rightSlider.circle.y },
            x
        );

    }

    mouseUp(x?: number, y?: number){
        this.leftSlider.mouseUp()
        this.rightSlider.mouseUp()
        this.area.mouseUp()
    }
}