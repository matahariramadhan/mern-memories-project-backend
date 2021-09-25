import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Wrong password" });

    const token = jwt.sign(
      { name: existingUser.name, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      result: {
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(404).json({ message: "User exists" });

    if (password !== confirmPassword)
      return res.status(404).json("Password didn't match");

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      name: `${firstName} ${lastName}`,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        // biar sama signin
        // email: result.email,
        name: result.name,
        id: result._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      // biar gak ngirim password ke client
      // result: result,
      result: { _id: result._id, email: result.email, name: result.name },
      token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
