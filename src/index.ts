type User = {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  support: {
    url: string;
    text: string;
  };
};

const getUsers = (ids: number[]): AsyncIterable<User> => {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        async next() {
          console.log("getUsers next");
          if (i === ids.length) {
            return { done: true, value: null };
          }
          const data = await fetch(
            `https://reqres.in/api/users/${ids[i++]}`
          ).then(res => res.json());
          return { done: false, value: data };
        },
      };
    },
  };
};

(async function () {
  for await (const user of getUsers([1, 2, 3, 4, 5])) {
    console.log(user);
  }
})();

(async function () {
  const iterator = getUsers([1, 2, 3, 4, 5])[Symbol.asyncIterator]();
  while (true) {
    const { done, value } = await iterator.next();
    if (done) break;
    console.log(value);
  }
})();

function map<T, U>(iter: AsyncIterable<T>, fn: (v: T) => U): AsyncIterable<U> {
  return {
    [Symbol.asyncIterator]() {
      const iterator = iter[Symbol.asyncIterator]();
      return {
        async next() {
          console.log("map next");
          const { done, value } = await iterator.next();
          if (done) return { done, value: null };
          return { done, value: fn(value) };
        },
      };
    },
  };
}

(async function () {
  for await (const num of map(
    getUsers([1, 2, 3, 4, 5]),
    user => user.data.id
  )) {
    console.log(num);
  }
})();
