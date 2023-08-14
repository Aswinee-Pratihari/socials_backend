import jwt from "jsonwebtoken";
import Router from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

const router = Router();

router.post("/signUp", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });
    const accessToken = jwt.sign({ user }, "Aswinee");
    res.cookie("access_token", accessToken, { httpOnly: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(402).json(error.message);
  }
});

router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json("user not found");
  } else {
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      res.status(401).json("invalid credentials");
    } else {
      const accessToken = jwt.sign({ user }, "Aswinee");
      res.cookie("access_token", accessToken, { httpOnly: true });
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    }
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...otherDetails } = user._doc;
    res.status(200).json(otherDetails);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const usersWithoutPasswords = users.map((rest) => rest._doc);

    const user = usersWithoutPasswords.map(({ password, ...rest }) => rest);
    const { password, ...otherDetails } = user;
    res.status(200).json(otherDetails);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/follow/:id", async (req, res) => {
  try {
    const FollowingUser = await User.findById(req.params.id);
    const FollowerUser = await User.findById(req.body.userId);
    if (!FollowingUser.followers.includes(req.body.userId)) {
      await FollowingUser.updateOne({ $push: { followers: req.body.userId } });
      await FollowerUser.updateOne({ $push: { following: req.params.id } });
      res.status(200).send("user followed");
    } else {
      await FollowingUser.updateOne({ $pull: { followers: req.body.userId } });
      await FollowerUser.updateOne({ $pull: { following: req.params.id } });
      res.status(200).send("user unfollowed");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});
export default router;
