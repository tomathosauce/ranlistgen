import { DistributionGenerator } from "./classes/DistributionGenerator";

export const sq = (n: number) => Math.pow(n, 2);
export const sqr = (n: number) => Math.sqrt(n);

export interface coordinate{
    x: number
    y: number
}

export interface Configuration {
	border: number
}

export const tpb = (t: number, p1: coordinate, p2: coordinate, p3: coordinate, a:"x"|"y") => {
	return (
		Math.pow(1 - t, 2) * p1[a] +
		2 * (1 - t) * t * p2[a] +
		Math.pow(t, 2) * p3[a]
	);
};

export function atbp(p1: coordinate, p2: coordinate, p3: coordinate, x: number) {
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

export function trans(canvas: HTMLCanvasElement, coors: coordinate): coordinate {
	return { x: coors.x, y: canvas.height - coors.y };
}
 
export function subtract(c1: coordinate, c2: coordinate) {
	return { x: c1.x - c2.x, y: c1.y - c2.y };
}

export function getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	};
}

export function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function shuffle(array: any[]) {
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

export function generar2(d:DistributionGenerator, amount: number) {
	var numbers = [];
  var n = 0;

	while (numbers.length < 1000) {
		var max = 10;
		var x = getRandomArbitrary(1, max);
		var y = getRandomArbitrary(50, 350);

		var Y = d.generateYBezier((x * 350) / max);

		if (y > Y) {
			numbers.push(x);
		}
	}
	return numbers.map((x) => Math.round(x)).join("\n");
}

export function generar(d:DistributionGenerator, border: number, amount?: number) {
	var numbers: number[] = [];
  	var n = 10;

	while (numbers.length < 1000) {

		for (let index = 0; index < n; index++) {
			var x = d.w/n*index+border*2
			var y = getRandomArbitrary(border, d.h);

			var Y = d.generateYBezier(x+10);

			console.log(Y)

			if (y > Y) {
				numbers.push(index+1);
				
			}

		}

	}
	return numbers.map((x) => Math.round(x)).join("\n");
}
