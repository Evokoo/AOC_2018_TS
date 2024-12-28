// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const track = parseInput(data);
	return simulateCarts(track, true);
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const track = parseInput(data);
	return simulateCarts(track, false);
}

type Features = Map<string, string>;
type Cart = {
	id: number;
	x: number;
	y: number;
	bearing: number;
	intersections: number;
	active: boolean;
};
interface Track {
	carts: Cart[];
	features: Features;
}

// Functions
function parseInput(data: string): Track {
	const layout: string[] = data.split("\n");
	const features: Features = new Map();
	const carts: Cart[] = [];

	for (let y = 0; y < layout.length; y++) {
		for (let x = 0; x < layout[0].length; x++) {
			const tile = layout[y][x];

			if (/[/\\+]/.test(tile)) {
				features.set(`${x},${y}`, tile);
			} else if (/[<>v^]/.test(tile)) {
				let bearing: number;

				switch (tile) {
					case ">":
						bearing = 90;
						break;
					case "<":
						bearing = 270;
						break;
					case "^":
						bearing = 0;
						break;
					case "v":
						bearing = 180;
						break;
					default:
						throw Error("Invalid tile");
				}

				carts.push({
					id: carts.length,
					x,
					y,
					bearing,
					intersections: 0,
					active: true,
				});
			}
		}
	}

	return { features, carts };
}

function simulateCarts(
	{ features, carts }: Track,
	firstCrash: boolean
): string {
	while (true) {
		for (const [index, cart] of carts.entries()) {
			carts[index] = updateCart(cart, features);

			for (let i = 0; i < carts.length; i++) {
				const cartA = carts[i];

				for (let j = i + 1; j < carts.length; j++) {
					const cartB = carts[j];

					if (cartA.x === cartB.x && cartA.y === cartB.y) {
						if (firstCrash) {
							return `${cartA.x},${cartA.y}`;
						} else {
							carts[i].active = false;
							carts[j].active = false;
						}
					}
				}
			}
		}

		//Sort carts by position
		carts = carts.sort((a, b) => a.y - b.y || a.x - b.x);
		//Remove crashed carts
		carts = carts.filter((cart) => cart.active);

		//If one cart remains return location
		if (carts.length === 1) {
			return `${carts[0].x},${carts[0].y}`;
		}
	}
}

function updateCart(cart: Cart, features: Features): Cart {
	switch (cart.bearing) {
		case 0:
			cart.y--;
			break;
		case 90:
			cart.x++;
			break;
		case 180:
			cart.y++;
			break;
		case 270:
			cart.x--;
			break;
		default:
			throw Error("Invalid Bearing");
	}

	switch (features.get(`${cart.x},${cart.y}`) ?? " ") {
		case "/":
			switch (cart.bearing) {
				case 0:
					cart.bearing = 90;
					break;
				case 90:
					cart.bearing = 0;
					break;
				case 180:
					cart.bearing = 270;
					break;
				case 270:
					cart.bearing = 180;
					break;
			}
			break;
		case "\\":
			switch (cart.bearing) {
				case 0:
					cart.bearing = 270;
					break;
				case 90:
					cart.bearing = 180;
					break;
				case 180:
					cart.bearing = 90;
					break;
				case 270:
					cart.bearing = 0;
					break;
			}
			break;
		case "+":
			switch (cart.intersections % 3) {
				case 0: // Turn left
					cart.bearing = (cart.bearing - 90 + 360) % 360;
					break;
				case 2: // Turn Right
					cart.bearing = (cart.bearing + 90) % 360;
					break;
				default: // Continue Straight
					break;
			}
			cart.intersections++;
			break;
		default:
			break;
	}

	return cart;
}
