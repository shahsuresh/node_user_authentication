import express from "express";
import addUserValidationSchema from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

//?==user routes====

//register user

router.post(
  "/user/register",
  async (req, res, next) => {
    // extract new data from req.body
    const newUser = req.body;
    try {
      //validate new data
      const validateData = await addUserValidationSchema.validate(newUser);
      req.body = validateData;
      // call next() function
      next();
    } catch (error) {
      // if validation fails, throw error
      return res.status(400).send({ error: error.message });
    }
  },
  async (req, res) => {
    //extract new data from req.body

    const newUser = req.body;

    //find user by email

    const user = await User.findOne({ email: newUser.email });

    //if user exists, throw error
    if (user) {
      return res.status(400).send({ error: "User already exists" });
    }
    // hash password
    const plainPassword = newUser.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    //replace plain password by hashed password

    newUser.password = hashedPassword;

    //create new user

    await User.create(newUser);

    //send response

    return res.status(200).send({ message: "User created successfully" });
  }
);

export default router;
