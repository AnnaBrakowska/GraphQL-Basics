import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

let posts = [
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

let users = [
  { id: "1", name: "Dejuan", email: "dejuan@gmail.com", age: 19 },
  { id: "2", name: "Martin", email: "martin@gmail.com", age: 20 },
  { id: "3", name: "Jess", email: "jess@gmail.com", age: 20 },
  { id: "4", name: "Madelynn", email: "madelynn@gmail.com", age: 23 },
  { id: "5", name: "Kaden", email: "kaden@gmail.com", age: 34 },
  { id: "6", name: "Alexandrine", email: "alexandrine@gmail.com", age: 29 },
  { id: "7", name: "Stuart", email: "stuart@gmail.com", age: 36 }
];

let comments = [
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

//RESOLVERS Object

const resolvers = {
  Query: {
    users(parent, args) {
      if (!args.query) return users;
      return users.filter(el => el.name.includes(args.query));
    },
    posts(parent, args) {
      if (!args.query) return posts;
      return posts.filter(el => {
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
      return comments;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    comments(parent, args) {
      return comments.filter(comment => comment.author === parent.id);
    },
    posts(parent, args, context, info) {
      return posts.filter(post => post.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);
      if (emailTaken) throw new Error("This email is taken");
      const user = {
        id: uuidv4(),
        name: args.data.name,
        email: args.data.email,
        age: args.data.age
      };
      users.push(user);
      return user;
    },
    createPost(parent, args) {
      const userExists = users.some(user => user.id === args.data.author);
      if (!userExists) throw new Error("This user doesn't exist");
      const post = {
        id: uuidv4(),
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: args.data.author
      };
      posts.push(post);
      return post;
    },
    createComment(parent, args) {
      const postExists = posts.some(post => post.id === args.data.post);
      const userExists = users.some(user => user.id === args.data.author);
      if (!postExists || !userExists)
        throw new Error(`This post or user does not exist`);
      const comment = {
        id: uuidv4(),
        text: args.data.text,
        author: args.data.author,
        post: args.data.post
      };
      comments.push(comment);
      return comment;
    },
    deleteUser(parent, args) {
      const userExists = users.find(user => user.id === args.id);
      if (!userExists) throw new Error("This user does not exist");
      comments = comments.filter(comments => comments.author !== args.id);
      posts = posts.filter(post => post.author !== args.id);
      users = users.filter(user => user.id !== args.id);
      return userExists;
    },
    deleteComment(parent, args) {
      const commentExists = comments.find(comment => comment.id === args.id);
      if (!commentExists) throw new Error("This comment does not exist");
      comments = comments.filter(comment => comment.id !== args.id);
      return commentExists;
    },
    deletePost(parent, args) {
      const postExists = posts.find(post => post.id === args.id);
      if (!postExists) throw new Error("This post does not exist");
      comments = comments.filter(comment => comment.post !== args.id);
      posts = posts.filter(post => post.id !== args.id);
      return postExists;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: resolvers
});

server.start(() => {
  console.log("Server running on port 4000");
});
