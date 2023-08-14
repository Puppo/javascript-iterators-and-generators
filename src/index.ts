function* range(start: number, end: number): Iterable<number> {
  while (start <= end) {
    console.log("range next");
    yield start++;
  }
}

for (const num of range(1, 10)) {
  console.log(num);
}

const iterator = range(1, 10)[Symbol.iterator]();
while (true) {
  const { done, value } = iterator.next();
  if (done) break;
  console.log(value);
}

for (const num of [...range(1, 10)]) {
  console.log(num);
}

function* mapIterable<T, U>(
  iterable: Iterable<T>,
  callback: (value: T) => U
): Iterable<U> {
  for (const value of iterable) {
    yield callback(value);
  }
}

const mapRange = mapIterable(range(1, 10), value => value * 10);

for (const num of mapRange) {
  if (num > 50) break;
  console.log(num);
}
