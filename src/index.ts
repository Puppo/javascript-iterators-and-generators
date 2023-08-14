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
        async return() {
          console.log("getUsers return");
          return { done: true, value: null };
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
  for (
    let result = await iterator.next();
    !result.done;
    result = await iterator.next()
  ) {
    console.log(result.value);
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
        async return() {
          console.log("map return");
          if (iterator?.return) await iterator?.return();
          return { done: true, value: null };
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
    if (num === 3) break;
    console.log(num);
  }
})();
