const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", { count: count });
      }, 1000);

      return pubsub.asyncIterator("count");
    }
  },
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const postFound = db.posts.find(
        post => postId === post.id && post.published
      );
      if (!postFound) throw new Error("Post was not found");
      return pubsub.asyncIterator(`comment ${postId}`);
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    }
  }
};

export { Subscription as default };
