export class ListNode<T> {
	data: T;
	next: ListNode<T> | null;
	previous: ListNode<T> | null;

	constructor(data: T) {
		this.data = data;
		this.next = null;
		this.previous = null;
	}
}

export class CircularLinkedList<T> {
	head: ListNode<T> | null;
	tail: ListNode<T> | null;

	constructor() {
		this.head = null;
		this.tail = null;
	}

	// Add a new node to the end of the circular linked list
	// append(data: T): void {
	// 	const newNode = new ListNode(data);

	// 	if (!this.head) {
	// 		// If the list is empty, set the new node as the head and make it circular
	// 		this.head = newNode;
	// 		newNode.next = this.head;
	// 	} else {
	// 		// Traverse the list to find the last node and append the new node
	// 		let current = this.head;
	// 		while (current.next !== this.head) {
	// 			current = current.next!;
	// 		}
	// 		current.next = newNode;
	// 		newNode.next = this.head; // Make the list circular
	// 	}
	// }

	// Add a new node to the end of the circular linked list
	append(data: T): void {
		const newNode = new ListNode(data);

		if (!this.tail || !this.head) {
			// If the list is empty, set the new node as the head and make it circular
			this.head = newNode;
			this.tail = newNode;
			newNode.next = this.head;
			newNode.previous = this.tail;
		} else {
			// Traverse the list to find the last node and append the new node
			let current = this.tail;
			// while (current.next !== this.head) {
			// 	current = current.next!;
			// }
			current.next = newNode;
			this.tail = newNode;
			newNode.next = this.head;
			newNode.previous = current; // Make the list circular
		}
	}

	size(): number {
		let count = 0;
		let current = this.head;
		if (current) {
			do {
				count++;
				current = current!.next;
			} while (current !== this.head);
		}
		return count;
	}

	slice(start: number, end: number) {
		let output = [];
		let current = this.head;

		for (let i = 0; i < end; i++) {
			if (i >= start) {
				output.push(current!.data);
			}

			current = current!.next;
		}

		return output;
	}

	sliceFromTail(len: number) {
		let output = [];
		let current = this.tail;

		for (let i = 0; i < len; i++) {
			output.unshift(current!.data);
			current = current!.previous;
		}

		return output;
	}
}
