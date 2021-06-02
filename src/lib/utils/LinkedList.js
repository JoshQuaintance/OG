function getRandomInt(min, max) {
    min = Math.min(min, max);
    max = Math.max(min, max);
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next || null;
    }

    toString() {
        return this.value;
        // return `${typeof this.value}( ${this.value} )`;
    }
}

class LinkedList {
    constructor(...values) {
        this.head = null;
        this.tail = null;
        this._size = 0;
        this._rawOutput = false;

        if (values.length > 0)
            for (let idx = 0; idx < values.length; idx++) {
                let curr = new Node(values[idx]);

                if (idx == 0) this.head = curr;
                else this.tail.next = curr;

                this.tail = curr;

                this._size++;
            }
    }

    /**
     * Push items into the end of the list
     * @param {...any} items New item to append
     */
    push(...items) {
        for (let item of items) {
            if (item == null) continue;

            let newItem = new Node(item);

            if (this.head == null) {
                this.head = newItem;
                this.tail = newItem;
                continue;
            }

            this.tail.next = newItem;
            this.tail = newItem;
        }
    }

    /**
     * Adds items into the beginning of the list
     * @param  {...any} items Items to add
     */
    unshift(...items) {
        for (let item of items.reverse()) {
            let newItem = new Node(item);
            newItem.next = this.head;
            this.head = newItem;
        }
    }

    pop(val) {
        let valIdx = this.indexOf(val);

        return this.popAt(valIdx);
    }

    popAt(idx) {
        this['__#9427@#checkSize']();

        if (idx == 0) {
            let ret = this.head;

            if (this.head == null) return this.head;

            this.head = this.head.next;

            return ret.value;
        }

        let beforeItem = this.rawAt(idx - 1);
        let item = this.rawAt(idx);

        beforeItem.next = item.next;

        return item.value;
    }

    clearList() {
        this.head = null;
        this.tail = null;

        this._size = 0;
    }

    shuffle(flips = 1) {
        for (let i = 0; i < flips; i++) {
            let cutPoint =
                this.length / 2 +
                (Math.random() < 0.5 ? -1 : 1) * getRandomInt(0, this.length / 10);

            let left = new LinkedList();
            let right = new LinkedList();

            new Function(
                'list',
                'left',
                'right',
                `
                let lastOfUnevenPile = list.head${'.next'.repeat(cutPoint)}
    
                left.head = list.head;
                left.tail = lastOfUnevenPile;
    
                right.head = lastOfUnevenPile.next;
                right.tail = list.tail;
    
                lastOfUnevenPile.next = null;
                `
            )(this, left, right);

            this.clearList();

            while (left.length > 0 && right.length > 0)
                if (getRandomInt(0, 1) >= left.length / right.length / 2) this.push(right.popAt(0));
                else this.push(left.popAt(0));

            while (left.length > 0) this.push(left.popAt(0));

            while (right.length > 0) this.push(right.popAt(0));
        }

        console.log(this);

        // make sure the size integrity
        this['__#9427@#checkSize']();
        return this;
    }

    toArray() {
        let curr = this.head;
        let ret = [];

        while (curr != null) {
            ret.push(curr.value);

            curr = curr.next;
        }

        return ret;
    }

    /**
     * Moves an item into an array
     * @param {Number} idx Index of item to move
     * @param {any[]} target Array for the item to move into
     */
    moveItemToArray(idx, target) {
        if (!Array.isArray(target)) throw new TypeError('Target is not an array');
        let item = this.rawAt(idx);

        target.push(item.value);

        this.popAt(idx);

        return target;
    }

    /**
     * Gets the index of an item
     * @param {any} val Value to get the index of
     * @returns {Number} The index of the item
     */
    indexOf(val) {
        let curr = this.head;
        let idx = 0;

        while (curr != null) {
            if (curr.value === val) return idx;

            curr = curr.next;
            idx++;
        }

        return -1;
    }

    /**
     * Sets a flag for the at function to return raw node
     * @param {Number} idx First Index
     * @param {Number} idx2 Second Index
     * @returns {Node | Node[]} Node or Node array
     */
    rawAt(idx, idx2) {
        this._rawOutput = 1;
        return this.at(idx, idx2);
    }

    /**
     * Get item at index or range
     * @param {Number} idx First Index
     * @param {Number} idx2 Second Index
     * @returns {any | any[]} Node or Node Array or the value of the node
     */
    at(idx, idx2) {
        let raw = this._rawOutput;

        let curr = this.head;

        // If idx or idx2 is smaller 0 (negatives) it's gonna
        // simulate going backwards by adding the length
        // with the negative index (subtracting)
        idx = idx < 0 ? this.length + idx : idx;

        // If the second index is not given, than just immediately return the value the most
        // efficient way

        if (idx2 == undefined)
            return new Function('curr', `return curr${'.next'.repeat(idx)}${raw ? '' : '.value'}`)(
                curr
            );

        // Similar as above
        // This one is put here to prevent it being undefined;
        idx2 = idx2 < 0 ? this.length + idx2 : idx2;

        // Min Max of where it should grab the item
        let min = Math.min(idx, idx2);
        let max = Math.max(idx, idx2);
        let ret = [];

        // Counts where we are at in the traversing and set it to min
        // because later on, the current will be at where the min is at
        // using a function trick
        let count = min;

        // Check if the index is out of range
        if (max > this.length - 1 || min < 0) throw new RangeError('Index out of range');

        // Uses a Function that is immediately invoked that will get to the minimum index possible
        // by repeating '.next' until the minimum amount is reached quickly
        // You gotta love interpreted languages
        curr = new Function('curr', `return curr${'.next'.repeat(min)}`)(curr);

        // then starting from where count was (which was min)
        // traverse through the list until the count is the same as max
        // or until current is just null then break (hehe Spangler)
        while (count != max && curr != null) {
            if (curr != null) {
                ret.push(curr);
                count++;
            } else break;

            curr = curr.next;
        }

        // Raw or not raw output
        ret = raw ? ret : ret.map((c) => c.value);

        // reset flag
        this._rawOutput = false;

        // if the return array is just 1 item, then just return that one item
        return ret.length == 1 ? ret[0] : ret;
    }

    // Iterator
    [Symbol.iterator]() {
        let curr = this.head;

        return {
            next: () => {
                let ret = curr;

                if (curr != null) curr = curr.next;

                return {
                    done: ret == null,
                    value: ret == null ? null : ret.value
                };
            }
        };
    }

    ['__#9427@#checkSize']() {
        let curr = this.head;

        if (curr == null) {
            this._size = 0;
            return;
        }

        this._size = 0;

        while (curr != null) {
            this._size++;

            if (curr != null) curr = curr.next;
        }
    }

    get length() {
        if (this._size == 0) this['__#9427@#checkSize']();

        return this._size;
    }

    toString() {
        let curr = this.head;
        let outVal = '';

        while (curr != null) {
            outVal += curr + ' -> ';

            if (curr != null) curr = curr.next;
        }

        outVal += 'null';

        return outVal;
    }
}

// prettier-ignore
// let x = new LinkedList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
//     12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
//     23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
//     34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
//     45, 46, 47, 48, 49, 50, 51, 52);
// // let x = new LinkedList()
// x.shuffle(4);

// console.log(x.toString());

export { LinkedList };
