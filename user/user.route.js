import express from "express";
import { addUserValidationSchema } from "./user.validation.js";
import { loginUserValidationSchema } from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

//?=====login user=====

router.post(
  "/user/login",
  async (req, res, next) => {
    //extract login data from req.body

    const userLoginData = req.body;

    try {
      // validate login data

      const validatedData = await loginUserValidationSchema.validate(
        userLoginData
      );
      req.body = validatedData;
    } catch (error) {
      //if validation, throw error
      return res.status(400).send({ error: error.message });
    }

    //call next function, if validation succeeds

    next();
  },
  async (req, res) => {
    // extract login credentials from req.body
    const loginCredentials = req.body;
    // find user by email
    const user = await User.findOne({ email: loginCredentials.email });
    // console.log(user);
    // if not user,throw error
    if (!user) {
      return res.status(404).send("Invalid Credentials");
    }
    // check for password match

    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    // if password does not match, throw error
    if (!isPasswordMatch) {
      return res.status(404).send("Invalid Credentials");
    }
    //to remove password from res
    user.password = undefined;

    //generate token
    //SHA 256 HASH sign for word "sh@h"  is:(601b52df50c4980c4147bee334fc578099452bf9aa19b014c46b7d628890cd23)
    //syntax: jwt.sign(payload,signature)

    const token = jwt.sign({ email: user.email }, "601b52d");
    //console.log(token);

    // send response
    return res
      .status(200)
      .send({ message: "Login Successful", userDetails: user, token: token });
  }
);

export default router;
