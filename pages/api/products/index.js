import dbConnect from "../../../util/mongoose";
import Product from "../../../models/Product";

export default async function handler(request, response) {
  //Get Method
  const { method, cookies } = request;

  const token = cookies.token;

  await dbConnect();

  if (method === "GET") {
    try {
      const products = await Product.find();
      response.status(200).json(products);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  if (method === "POST") {
    if (!token || token !== process.env.TOKEN) {
      return response.status(404).json("Not Authenticated!");
    }
    try {
      const product = await Product.create(request.body);
      response.status(200).json(product);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}
