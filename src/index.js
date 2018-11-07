import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import db from "./db";

//RESOLVERS Object

const resolvers = {
  Query: {
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
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.author === parent.id);
    },
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => post.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => {
        return post.id === parent.post;
      });
    }
  },
  Mutation: {
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
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: resolvers,
  context: { db }
});

server.start(() => {
  console.log("Server running on port 4000");
});
