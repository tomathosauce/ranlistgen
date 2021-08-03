import { DistributionGenerator } from "./classes/DistributionGenerator";
import { getMousePos, getRandomArbitrary, Configuration, shuffle } from "./lib";
var dragging = false;
var lastPos = {x: 0, y: 0};
var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
var context = canvas.getContext("2d");

context.imageSmoothingEnabled = true;
context.font = "10px Arial";

var configuration: Configuration = {
	border: 25
}


function erase() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

var start = <HTMLInputElement>document.getElementById("inicio");
var end = <HTMLInputElement>document.getElementById("final");
var cant = <HTMLInputElement>document.getElementById("cant");

var generateButton = document.getElementById("gen")

var d = new DistributionGenerator(
	context,
	canvas,
	configuration.border,
	configuration.border,
	canvas.width-configuration.border*2,
	canvas.height-configuration.border*2
)
d.draw()


function generar(
	d:DistributionGenerator,
	conf: Configuration, 
	start: number,
	end: number,
	numeros: number
	) {
	var numbers: number[] = [];
  	var n = end-start;

	while (numbers.length < numeros) {

		for (let index = 0; index <= n; index++) {
			var x = d.w/n*index+conf.border*2
			var y = getRandomArbitrary(conf.border, d.h);

			var Y = d.generateYBezier(x);

			//console.log(Y)

			if (y > Y) {
				numbers.push(index+start);
				
			}

			if(numbers.length >= numeros){
				break
			}

		}

	}

	console.log(numbers)
	return shuffle(numbers.map((x) => Math.round(x))).join("\n");
}


canvas.addEventListener(
	"mousedown",
	function (evt) {
		var { x, y } = getMousePos(canvas, evt);
		lastPos = { x, y };
		dragging = true;
		d.mouseDown(x,y)
		console.log("mousedown");
	},
	false
);

canvas.addEventListener(
	"mousemove",
	function (evt) {
		var { x, y } = getMousePos(canvas, evt);

		if (dragging) {

			d.mouseMove(x,y,lastPos)
		}
		lastPos = { x, y };
	},
	false
);

canvas.addEventListener(
	"mouseup",
	function (evt) {
		var mousePos = getMousePos(canvas, evt);
		lastPos = mousePos;
		dragging = false;
		console.log("mouseup");
		d.mouseUp()
	},
	false
);

generateButton.addEventListener("click", () => {
	document.getElementById("text").textContent = generar(
		d,
		configuration,
		Number(start.value),
		Number(end.value),
		Number(cant.value)
	);
});


start.addEventListener("change", function(){
	if(start.value >= end.value){
		end.value=`${Number(start.value)+ 5}`
	}
})