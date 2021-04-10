const express = require("express");
const {
  get,
  getById,
  insert,
  update,
  remove,
  getUserPosts,
  newPost,
} = require("./users-model");
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

const validateUserId = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).json({ message: "Not found" });
  }
  getById(id).then((user) => {
    if (!user) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    req.user = user;
    try {
      next();
    } catch (e) {
      console.log(e);
    }
  });
};

const validateUser = (req, res, next) => {
  if (!req.body.name) {
    res
      .status(400)
      .json({ message: "missing user data or missing required name" });
    return;
  }
  next();
};

const validatePost = (req, res, next) => {
  const { text } = req.body;
  if (!req.params.id) {
    res.status(400).json({ message: "missing user id" });
    return;
  }
  if (!text) {
    res
      .status(400)
      .json({ message: "missing post data or missing required text field" });
    return;
  }
  next();
};

router.get("/", (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  get().then((users) => {
    res.status(200).json(users);
  });
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post("/", validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  insert(req.body)
    .then((user) => {
      if (!user) res.status(500);
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  update(req.user.id, req.body).then((user) => {
    if (!user) res.status(500);
    getById(req.user.id).then((newUser) => {
      res.status(200).json(newUser);
    });
  });
});

router.delete("/:id", validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  remove(req.user.id).then((total) => {
    res.status(200).json(req.user);
  });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  getUserPosts(req.user.id).then((posts) => {
    res.status(200).json(posts);
  });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  newPost({ text: req.body.text, user_id: req.params.id }).then((posts) => {
    res.status(200).json(posts[posts.length - 1]);
  });
});

// do not forget to export the router
module.exports = { router };
