const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) return db.users;
    return db.users.filter(el => el.name.includes(args.query));
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts;
    return db.posts.filter(el => {
      const isTitleMatch = el.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      const isBodyMatch = el.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      return isTitleMatch || isBodyMatch;
    });
  },
  post() {
    return {
      id: 1,
      title: "Post 1",
      body: "Hola hola to the first post",
      published: false
    };
  },
  me() {
    return {
      name: "Bob",
      age: 29
    };
  },
  comments() {
    return db.comments;
  }
};

export { Query as default };
