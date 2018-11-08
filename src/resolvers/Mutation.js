const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);
    if (emailTaken) throw new Error("This email is taken");
    const user = {
      id: uuidv4(),
      name: args.data.name,
      email: args.data.email,
      age: args.data.age
    };
    db.users.push(user);
    return user;
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) throw new Error("This user doesn't exist");
    const post = {
      id: uuidv4(),
      title: args.data.title,
      body: args.data.body,
      published: args.data.published,
      author: args.data.author
    };
    db.posts.push(post);
    return post;
  },
  createComment(parent, args, { db }, info) {
    const postExists = db.posts.some(post => post.id === args.data.post);
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!postExists || !userExists)
      throw new Error(`This post or user does not exist`);
    const comment = {
      id: uuidv4(),
      text: args.data.text,
      author: args.data.author,
      post: args.data.post
    };
    db.comments.push(comment);
    return comment;
  },
  deleteUser(parent, args, { db }, info) {
    const userExists = db.users.find(user => user.id === args.id);
    if (!userExists) throw new Error("This user does not exist");
    db.comments = db.comments.filter(comments => comments.author !== args.id);
    db.posts = db.posts.filter(post => post.author !== args.id);
    db.users = db.users.filter(user => user.id !== args.id);
    return userExists;
  },
  deleteComment(parent, args, { db }, info) {
    const commentExists = db.comments.find(comment => comment.id === args.id);
    if (!commentExists) throw new Error("This comment does not exist");
    db.comments = db.comments.filter(comment => comment.id !== args.id);
    return commentExists;
  },
  deletePost(parent, args, { db }, info) {
    const postExists = db.posts.find(post => post.id === args.id);
    if (!postExists) throw new Error("This post does not exist");
    db.comments = db.comments.filter(comment => comment.post !== args.id);
    db.posts = db.posts.filter(post => post.id !== args.id);
    return postExists;
  },
  updateUser(parent, args, { db }, info) {
    console.log(args.data);
    const user = db.users.find(user => user.id === args.id);
    if (!user) throw new Error("User not found");

    if (typeof args.data.email === "string") {
      const emailTaken = db.users.some(user => user.email === args.data.email);
      if (emailTaken) throw new Error("Email is taken");
      user.email === args.data.email;
    }
    if (typeof args.data.name === "string") {
      user.name = args.data.name;
    }
    if (typeof args.data.age !== "undefined") {
      user.age = args.data.age;
    }
    return user;
  },
  updatePost(parent, args, { db }, info) {
    const postExists = posts.find(post => post.id === args.id);
    if (!postExists) throw new Error("This post does not exist");
    if (typeof data.args.title === "string") {
      postExists.title = data.args.title;
    }
    if (typeof data.args.body === "string") {
      postExists.body = data.args.body;
    }
    if (data.args.published !== postExists.published) {
      postExists.published = data.args.published;
    }
    return postExists;
  },
  updateComment(parent, args, { db }, info) {
    const commentExists = comments.find(comment => comment.id === args.id);
    if (!commentExists) throw new Error("This comment does not exist");
    if (typeof data.args.text === "string") {
      commentExists.text = data.args.text;
    }
    return commentExists;
  }
};

export { Mutation as default };
