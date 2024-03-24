// Imports
import TOOLS from "../00/tools";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day),
		{ track, carts } = parseInput(data),
		location = runSimulation(track, carts);

	return `${location.x},${location.y}`;
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day),
		{ track, carts } = parseInput(data),
		cart = runSimulation(track, carts, true);

	return `${cart.x},${cart.y}`;
}

//Run
solveB("example_b", "13");

// Functions
type Cart = {
	ID: number;
	x: number;
	y: number;
	bearing: number;
	intersections: number;
	active: boolean;
};

function parseInput(data: string) {
	const track = data.split("\r\n");
	const carts: Cart[] = [];

	for (let y = 0; y < track.length; y++) {
		for (let x = 0; x < track[0].length; x++) {
			const tile = track[y][x];

			let bearing = -1;

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
					continue;
			}

			if (bearing >= 0) {
				carts.push({
					ID: carts.length,
					x,
					y,
					bearing,
					intersections: 0,
					active: true,
				});
			} else {
				continue;
			}
		}
	}

	return { track, carts };
}
function sortCarts(carts: Cart[]): Cart[] {
	return carts.sort((a, b) => a.y - b.y || a.x - b.x);
}
function updateCart(cart: Cart, track: string[]) {
	switch (cart.bearing) {
		case 0:
			cart.y--;
			break;
		case 180:
			cart.y++;
			break;
		case 270:
			cart.x--;
			break;
		case 90:
			cart.x++;
			break;
		default:
			throw Error("Invalid bearing");
	}

	const nextTile = track[cart.y][cart.x];

	switch (nextTile) {
		case "/":
			if (cart.bearing === 270) {
				cart.bearing = 180;
			} else if (cart.bearing === 0) {
				cart.bearing = 90;
			} else if (cart.bearing === 180) {
				cart.bearing = 270;
			} else if (cart.bearing === 90) {
				cart.bearing = 0;
			}
			break;
		case "\\":
			if (cart.bearing === 90) {
				cart.bearing = 180;
			} else if (cart.bearing === 0) {
				cart.bearing = 270;
			} else if (cart.bearing === 180) {
				cart.bearing = 90;
			} else if (cart.bearing === 270) {
				cart.bearing = 0;
			}
			break;
		case "+":
			const newDirection = cart.intersections % 3;

			switch (newDirection) {
				case 0:
					cart.bearing = (cart.bearing - 90 + 360) % 360;
					break;
				case 1:
					break;
				case 2:
					cart.bearing = (cart.bearing + 90 + 360) % 360;
					break;
				default:
					throw Error("Invalid newDirection");
			}

			cart.intersections++;
			break;
		case "|":
		case "-":
		case ">":
		case "<":
		case "v":
		case "^":
			break;
		default:
			throw Error("Invalid tile");
	}

	return cart;
}
function getCrashReport(carts: Cart[]) {
	const report = { crash: false, location: { x: 0, y: 0 }, carts: [] };

	for (let i = 0; i < carts.length; i++) {
		const cartA = carts[i];

		if (!cartA.active) continue;

		for (let j = i + 1; j < carts.length; j++) {
			const cartB = carts[j];

			if (!cartB.active) continue;

			if (cartA.x === cartB.x && cartA.y === cartB.y) {
				return {
					crash: true,
					location: { x: cartA.x, y: cartA.y },
					carts: [cartA.ID, cartB.ID],
				};
			}
		}
	}

	return report;
}
function runSimulation(track: string[], carts: Cart[], partB: boolean = false) {
	while (true) {
		carts = sortCarts(carts);

		const activeCarts = carts.filter((cart) => cart.active === true);

		if (activeCarts.length === 1) {
			const lastCart = activeCarts[0];
			return { x: lastCart.x, y: lastCart.y };
		}

		for (let i = 0; i < carts.length; i++) {
			if (carts[i].active === false) continue;

			carts[i] = updateCart(carts[i], track);

			const report = getCrashReport(carts);

			if (report.crash) {
				if (partB) {
					carts = carts.map((cart) => {
						if (report.carts.includes(cart.ID)) cart.active = false;
						return cart;
					});
				} else {
					return report.location;
				}
			}
		}
	}
}
