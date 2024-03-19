import express from "express";
import { addProductValidationSchema } from "./product.validation.js";
import Product from "./product.model.js";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express();

//? ==add product===

router.post(
  "/product/add",
  async (req, res, next) => {
    //extract authorization token from req.body

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

//?===get product details=====
router.get(
  "/product/details/:id",
  async (req, res, next) => {
    //  extract authorization from req.headers
    const authorization = req?.headers?.authorization;

    // extract token from authorization
    const splittedValues = authorization?.split(" ");

    const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

    // if not token, throw error
    if (!token) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    let payload;
    try {
      // verify token using jwt and extract payload
      payload = jwt.verify(token, "601b52d");
    } catch (error) {
      // if not valid token, throw error
      return res.status(401).send({ message: "Unauthorized." });
    }

    // find user in our system using payload
    const user = await User.findOne({ email: payload.email });

    // if not user, throw error
    if (!user) {
      return res.status(401).send({ message: "Unauthorized." });
    }
    // call next function
    next();
  },
  (req, res, next) => {
    // extract id from req.params
    const id = req.params.id;

    // check for mongo id validity
    const isValidMongoId = mongoose.isValidObjectId(id);

    // if not valid mongo id, throw error
    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid mongo id." });
    }

    // call next function
    next();
  },
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // send res
    return res
      .status(200)
      .send({ message: "success", productDetails: product });
  }
);

//?====delete product======

router.delete(
  "/product/delete/:id",
  async (req, res, next) => {
    //  extract authorization from req.headers
    const authorization = req?.headers?.authorization;

    // extract token from authorization
    const splittedValues = authorization?.split(" ");

    const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;
    //console.log(token);

    // if not token, throw error
    if (!token) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    let payload;
    try {
      // verify token using jwt and extract payload
      payload = jwt.verify(token, "601b52d");
    } catch (error) {
      // if not valid token, throw error
      return res.status(401).send({ message: "Unauthorized." });
    }

    // find user in our system using payload
    const user = await User.findOne({ email: payload.email });

    // if not user, throw error
    if (!user) {
      return res.status(401).send({ message: "Unauthorized." });
    }
    // call next function
    next();
  },
  (req, res, next) => {
    // extract id from req.params
    const id = req.params.id;

    // check for mongo id validity
    const isValidMongoId = mongoose.isValidObjectId(id);

    // if not valid mongo id, throw error
    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid Mongo Id." });
    }

    // call next function
    next();
  },
  async (req, res) => {
    //extract id from params
    const id = req.params.id;

    //find product

    const product = await Product.findOne({ _id: id });

    //if product not found, throw error
    if (!product) {
      return res.status(404).send({ message: "Product doesn't exist" });
    }
    //delete product
    await Product.deleteOne({ _id: id });

    //send response

    return res.status(200).send({ message: "Product deleted successfully" });
  }
);
export default router;
