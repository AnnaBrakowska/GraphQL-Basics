const posts = [
  { id: "1", title: "Hello1", body: "asgd", published: true, author: "1" },
  {
    id: "2",
    title: "Hello2",
    body: "asgasdfsgddd",
    published: false,
    author: "2"
  },
  { id: "3", title: "Hello3", body: "vbnasgd", published: true, author: "3" },
  { id: "4", title: "Hello4", body: "sadfasgd", published: false, author: "4" }
];

const users = [
  { id: "1", name: "Dejuan", email: "dejuan@gmail.com", age: 19 },
  { id: "2", name: "Martin", email: "martin@gmail.com", age: 20 },
  { id: "3", name: "Jess", email: "jess@gmail.com", age: 20 },
  { id: "4", name: "Madelynn", email: "madelynn@gmail.com", age: 23 },
  { id: "5", name: "Kaden", email: "kaden@gmail.com", age: 34 },
  { id: "6", name: "Alexandrine", email: "alexandrine@gmail.com", age: 29 },
  { id: "7", name: "Stuart", email: "stuart@gmail.com", age: 36 }
];

const comments = [
  {
    id: "1",
    text: "This worked well for me. Thanks!",
    author: "1",
    post: "1"
  },
  {
    id: "2",
    text: "Glad you enjoyed it.",
    author: "2",
    post: "2"
  },
  {
    id: "3",
    text: "This did no work.",
    author: "3",
    post: "3"
  },
  {
    id: "4",
    text: "Nevermind. I got it to work.",
    author: "4",
    post: "4"
  }
];

const db = {
  users: users,
  comment: comments,
  posts: posts
};

export { db as default };
