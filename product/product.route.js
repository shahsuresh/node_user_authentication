import express from "express";
import { addProductValidationSchema } from "./product.validation.js";
import Product from "./product.model.js";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";

const router = express();

//? ==add product===

router.post(
  "/product/add",
  async (req, res, next) => {
    //extract authorization from req.body

    const authorization = req.headers.authorization;
    //extract token from authorization

    const splittedValues = authorization?.split(" ");

    const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;
    //if token not found,throw error
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    //verify token using jwt.verify() method
    let payload;
    try {
      //syntax
      //payload=jwt.verify(token,signature)

      payload = jwt.verify(token, "601b52d");
    } catch (error) {
      //if any error in token, throw error
      return res.status(401).send({ message: "Unauthorized" });
    }

    //find user using email from payload

    const user = await User.findOne({ email: payload.email });

    //if user of that email  does not exist,throw error

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    //call next() function
    next();
  },
  async (req, res, next) => {
    //extract data from req.body
    const newProduct = req.body;
    try {
      //validate req.body

      const validatedProduct = await addProductValidationSchema.validate(
        newProduct
      );
      req.body = validatedProduct;
      //call next() function
      next();
    } catch (error) {
      //if newProduct validation error, throw error message
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    //extract new product data from req.body

    const newProduct = req.body;
    //console.log(newProduct);

    //add product
    await Product.create(newProduct);

    //send response

    return res.status(201).send({ message: "New product added successfully" });
  }
);

export default router;
