var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
context.font = "10px Arial";

const sq = (n) => Math.pow(n, 2);
const sqr = (n) => Math.sqrt(n);

const tpb = (t, p1, p2, p3, a) => {
	return (
		Math.pow(1 - t, 2) * p1[a] +
		2 * (1 - t) * t * p2[a] +
		Math.pow(t, 2) * p3[a]
	);
};

function atbp(p1, p2, p3, x) {
	var t =
		(p1.x -
			p2.x +
			Math.sqrt(
				x * p1.x +
					x * p3.x -
					2 * x * p2.x +
					Math.pow(p2.x, 2) -
					p1.x * p3.x
			)) /
		(p1.x - 2 * p2.x + p3.x);
	//console.log("atbp t:", p1.x-2*p2.x+p3.x)
	//console.log(p1,p2,p3)
	var y = tpb(t, p1, p2, p3, "y");
	return y;
}

function erase() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function trans(coors) {
	return { x: coors.x, y: canvas.height - coors.y };
}

var dragAreaConf = {
	size: canvas.height - 100,
};

class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.isDragging = false;
		this.color = "red";
	}

	inside(x, y, dx = 0, dy = 0) {
		return sqr(sq(this.x - x + dx) + sq(this.y - y + dy)) <= this.r;
	}

	draw(x, y) {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	}

	change(x, y) {
		this.x = x;
		this.y = y;
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
}

class Slider {
	constructor(x, y, length, orientation, r1, r2) {
		this.x = x;
		this.y = y;
		this.l = length;
		this.o = orientation;
		this.t = 10;
		if ((this.o = "v")) {
			this.circle = new Circle(x + this.t / 2, y, this.t);
		} else {
			this.circle = new Circle(x, y + this.t / 2, this.t);
		}
	}
	draw() {
		context.fillStyle = "black";
		if ((this.o = "v")) {
			//context.fillRect(this.x, this.y, this.t, this.l);
			this.circle.draw();
		} else {
			//context.fillRect(this.x, this.y, this.l, this.t);
			this.circle.draw();
		}
	}

	move(dx, dy) {
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

	mouseMove(x, y, lastPos) {
		if (this.circle.inside(x, y)) {
			var { x: dx, y: dy } = subtract({ x, y }, lastPos);
			this.move(dx, dy);
			this.draw();
		}
	}

	mouseUp(x, y) {
		this.correct();
		this.draw();
	}
}

class DraggableDotArea {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.circle = new Circle(canvas.width / 2 - 1, canvas.height / 2, 10);
	}

	draw() {
		context.fillStyle = "grey";
		context.fillRect(this.x, this.y, this.w, this.h);
		this.circle.draw();
		context.fillText(
			`x: ${this.circle.x}, y: ${canvas.height - this.circle.y}`,
			this.circle.x + 10,
			this.circle.y
		);
	}

	move(dx, dy) {
		var chy = this.circle.y + dy;
		var chx = this.circle.x + dx;
		if (this.y < chy && chy < this.y + this.h) {
			this.circle.move(0, dy);
		}
		if (this.x < chx && chx < this.x + this.w) {
			this.circle.move(dx, 0);
		}
	}

	mouseMove(x, y, lastPos) {
		if (this.circle.inside(x, y)) {
			var { x: dx, y: dy } = subtract({ x, y }, lastPos);
			this.move(dx, dy);
			this.draw();
		}
	}

	mouseUp(x, y) {}
}

class ThreePointBezier {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.interval = 0.01;
	}

	drawDot(x, y) {
		context.fillRect(x, y, 2, 2);
	}

	translate() {}

	draw() {
		context.fillStyle = "blue";
		for (var t = 0; t < 1; t += this.interval) {
			var bx = tpb(t, this.p1, this.p2, this.p3, "x");

			var by = tpb(t, this.p1, this.p2, this.p3, "y");
			this.drawDot(bx, by);
			context.fillRect(bx, by, 2, 350 - by);
		}
	}

	change(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}

	mouseUp() {}
	mouseMove(x, y) {}
}

var items = [];
items.push(
	new DraggableDotArea(50, 50, canvas.width - 100, canvas.height - 100)
);
items.push(new Slider(45, 50, canvas.height - 100, "v", 0, 1));
items.push(new Slider(canvas.width - 55, 50, canvas.height - 100, "v", 0, 1));

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

items.push(
	new ThreePointBezier(
		{ x: items[1].circle.x, y: items[1].circle.y },
		{ x: items[0].circle.x, y: items[0].circle.y },
		{ x: items[2].circle.x, y: items[2].circle.y }
	)
);

var YG = (x) =>
	atbp(
		{ x: items[1].circle.x, y: items[1].circle.y },
		{ x: items[0].circle.x, y: items[0].circle.y },
		{ x: items[2].circle.x, y: items[2].circle.y },
		x
	);

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function generar(amount) {
	var numbers = [];
  var n = 10; 

	while (numbers.length < 1000) {

		for (let index = 0; index < n; index++) {
      var x = 300/10*index+50
      var y = getRandomArbitrary(50, 300);

      var Y = YG(x);
  
      if (y > Y) {
        numbers.push(index+1);
      }
      
    }

	}
	return numbers.map((x) => Math.round(x)).join("\n");
}

for (var i of items) {
	i.draw();
}


function generar2(amount) {
	var numbers = [];
  var n = 0; 

	while (numbers.length < 1000) {
		var max = 10;
		var x = getRandomArbitrary(1, max);
		var y = getRandomArbitrary(50, 350);

		var Y = YG((x * 350) / max);

		if (y > Y) {
			numbers.push(x);
		}
	}
	return numbers.map((x) => Math.round(x)).join("\n");
}

for (var i of items) {
	i.draw();
}

// context.fillStyle = "black";
// for(var i = 0; i<canvas.width; i+=2){

//   var y = atbp(    { x: items[1].circle.x, y: items[1].circle.y },
//     { x: items[0].circle.x, y: items[0].circle.y },
//     { x: items[2].circle.x, y: items[2].circle.y }, i)

//   context.fillRect(i, y, 10,10)
// }

function subtract(c1, c2) {
	return { x: c1.x - c2.x, y: c1.y - c2.y };
}

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	};
}

//var c = new Circle(100, 100, 50);
//c.draw();

var dragging = false;
var lastPos = {};
canvas.addEventListener(
	"mousedown",
	function (evt) {
		var { x, y } = getMousePos(canvas, evt);
		lastPos = { x, y };
		dragging = true;

		console.log("mousedown");
	},
	false
);

canvas.addEventListener(
	"mousemove",
	function (evt) {
		var { x, y } = getMousePos(canvas, evt);

		if (dragging) {
			for (var i of items) {
				erase();
				i.mouseMove(x, y, lastPos);
				for (var j of items) {
					j.draw();
				}
			}

			items[3].change(
				{ x: items[1].circle.x, y: items[1].circle.y },
				{ x: items[0].circle.x, y: items[0].circle.y },
				{ x: items[2].circle.x, y: items[2].circle.y }
			);
			for (var k of items) {
				k.draw();
			}

			//       context.fillStyle = "black";
			// for(var i = 0; i<canvas.width; i+=20){

			//   var y = atbp(    { x: items[1].circle.x, y: items[1].circle.y },
			//     { x: items[0].circle.x, y: items[0].circle.y },
			//     { x: items[2].circle.x, y: items[2].circle.y }, i)

			//   context.fillRect(i, y, 10,10)
			// }
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
		for (var i of items) {
			i.mouseUp();
		}
	},
	false
);

document.getElementById("gen").addEventListener("click", () => {
	document.getElementById("text").textContent = generar();
});
