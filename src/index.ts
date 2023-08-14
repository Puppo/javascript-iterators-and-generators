const array = [1, 2, 3, 4, 5];
const iterator = array[Symbol.iterator]();
for (let result = iterator.next(); !result.done; result = iterator.next()) {
  console.log(result.value);
}

const range = (start: number, end: number): Iterable<number> => {
  return {
    [Symbol.iterator]() {
      let n = start;
      return {
        next() {
          console.log("range next");
          if (n > end) {
            return { done: true, value: null };
          }
          return { done: false, value: n++ };
        },
        return() {
          console.log("range return");
          return { done: true, value: null };
        },
      };
    },
  };
};

// for (const num of range(1, 10)) {
//   console.log(num);
// }

// const iterator = range(1, 10)[Symbol.iterator]();
// for (let result = iterator.next(); !result.done; result = iterator.next()) {
//   const { done, value } = iterator.next();
//   if (done) break;
//   console.log(value);
// }

// for (const num of [...range(1, 10)]) {
//   console.log(num);
// }

function mapIterable<T, U>(
  iterable: Iterable<T>,
  callback: (value: T) => U
): Iterable<U> {
  return {
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();
      return {
        next() {
          console.log("mapIterable next");
          const { done, value } = iterator.next();
          if (done) {
            return { done: true, value: null };
          }
          return { done, value: callback(value) };
        },
        return() {
          console.log("mapIterable return");
          if (iterator.return) {
            iterator.return();
          }
          return { done: true, value: null };
        },
      };
    },
  };
}

const mapRange = mapIterable(range(1, 10), value => value * 10);

for (const num of mapRange) {
  if (num > 50) break;
  console.log(num);
}
