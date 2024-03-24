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
	public append(data: T): void {
		const newNode = new ListNode(data);

		if (!this.tail || !this.head) {
			this.head = newNode;
			this.tail = newNode;
			newNode.next = this.head;
			newNode.previous = this.tail;
		} else {
			let current = this.tail;

			current.next = newNode;
			this.tail = newNode;
			newNode.next = this.head;
			newNode.previous = current;
		}
	}

	public insertAfter(current: ListNode<T> | null, data: T): void {
		if (!current) {
			throw Error("No Node supplied");
		}

		const newNode = new ListNode(data);

		newNode.next = current.next;
		newNode.previous = current;

		if (current.next) {
			current.next.previous = newNode;
		}

		current.next = newNode;

		if (current === this.tail) {
			this.tail = newNode;
		}
	}

	public delete(current: ListNode<T>): void {
		if (!current) {
			throw Error("No node supplied");
		}

		if (current === this.head) {
			this.head = current.next;
		}

		if (current === this.tail) {
			this.tail = current.previous;
		}

		if (current.next) {
			current.next.previous = current.previous;
		}

		if (current.previous) {
			current.previous.next = current.next;
		}
	}

	public toArray(): T[] {
		const result: T[] = [];

		if (!this.head) {
			return result;
		}

		let current: ListNode<T> | null = this.head;

		do {
			result.push(current.data);
			current = current.next;
		} while (current && current !== this.head);

		return result;
	}

	public size(): number {
		let size: number = 0;

		if (!this.head) {
			return size;
		}

		let current: ListNode<T> | null = this.head;

		do {
			size++;
			current = current.next;
		} while (current && current !== this.head);

		return size;
	}
}
