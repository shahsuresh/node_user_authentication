import mongoose from "mongoose";

//set rules for collection
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 65,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {}
);

// create collection
const Product = mongoose.model("Product", productSchema);

export default Product;
