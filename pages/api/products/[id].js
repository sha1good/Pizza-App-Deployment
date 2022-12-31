import dbConnect from "../../../util/mongoose";
import Product from "../../../models/Product";

export default async function handler(request, response) {
  //Get Method
  const {
    method,
    query: { id },
  } = request;

  await dbConnect();
  
  if (method === "GET") {
    try {
      const product = await Product.findById(id);
      response.status(200).json(product);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  if (method === "PUT") {
    try {
      const product = await Product.create(request.body);
      response.status(200).json(product);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  if (method === "DELETE") {
    try {
      await Product.findByIdAndDelete(id);
      response.status(200).json("Pizza has been deleted");
    } catch (error) {
      response.status(500).json(error);
    }
  }
}
