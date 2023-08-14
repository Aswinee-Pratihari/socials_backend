import Router from "express";
import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import { verifyToken } from "../middleware/TokenVerification.js";
const router = Router();

//create a
router.post("/", verifyToken, async (req, res) => {
  try {
    const post = await Post.create({ userId: req.user.user._id, ...req.body });

    res.status(200).json(post);
  } catch (error) {
    res.status(200).json(error);
  }
  // res.status(200).json(req.user.user);
});

//update a post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.user.user._id) {
      await post.updateOne({ $set: req.body }, { new: true });
      res.status(200).json(post);
    } else {
      res.status(404).send("you are not allowed to update this post");
    }
  } catch (error) {
    res.status(200).json(error);
  }
});

//delete a post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.user.user._id) {
      await post.deleteOne({ $set: req.body }, { new: true });
      res.status(200).send("post deleted");
    } else {
      res.status(404).send("you are not allowed to delete this post");
    }
  } catch (error) {
    res.status(200).json(error);
  }
});

//like a post
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.user._id)) {
      await post.updateOne(
        { $push: { likes: req.user.user._id } },
        { new: true }
      );
      res.status(200).send("post has been liked");
    } else {
      await post.updateOne(
        { $pull: { likes: req.user.user._id } },
        { new: true }
      );
      res.status(200).send("post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//bookmark
router.put("/bookmark/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.bookmark.includes(req.user.user._id)) {
      await post.updateOne(
        { $push: { bookmark: req.user.user._id } },
        { new: true }
      );
      res.status(200).send("post has been bookmarked");
    } else {
      await post.updateOne(
        { $pull: { bookmark: req.user.user._id } },
        { new: true }
      );
      res.status(200).send("post has been removed from bookmark");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//post from timeline
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);

    // res.json("currentUser");
    const userPosts = await Post.find({ userId: currentUser._id });
    const followingPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...followingPosts));
    // res.status(200).json(followingPosts);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default router;
