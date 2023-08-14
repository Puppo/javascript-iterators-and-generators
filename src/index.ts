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

async function* getUsers(ids: number[]) {
  for (const id of ids) {
    console.log("getUsers next");
    const data = fetch(`https://reqres.in/api/users/${id}`).then(res =>
      res.json()
    );
    yield data;
  }
}

// (async function () {
//   for await (const user of getUsers([1, 2, 3, 4, 5])) {
//     console.log(user);
//   }
// })();

// (async function () {
//   const iterator = getUsers([1, 2, 3, 4, 5])[Symbol.asyncIterator]();
//   while (true) {
//     const { done, value } = await iterator.next();
//     if (done) break;
//     console.log(value);
//   }
// })();

async function* map<T, U>(
  asyncIterable: AsyncIterable<T>,
  callback: (value: T) => U
) {
  for await (const item of asyncIterable) {
    yield callback(item);
  }
}

(async function () {
  for await (const num of map(
    getUsers([1, 2, 3, 4, 5]),
    user => user.data.id
  )) {
    console.log(num);
  }
})();
