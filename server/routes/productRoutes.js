import express from "express";
import data from "../data.js";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);

productRouter.get(
  "/seed",
  expressAsyncHandler(async (re, res) => {
    const createdProduct = await Product.insertMany(data.products);
    res.send({ createdProduct });
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product ot Found" });
    }
  })
);
export default productRouter;
