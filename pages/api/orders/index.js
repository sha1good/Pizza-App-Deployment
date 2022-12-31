import dbConnect from "../../../util/mongoose";
import Order from "../../../models/Order";

export default async function handler(request, response) {
  const { method } = request;

  await dbConnect();

  if (method === "GET") {
    try {
      const orders = await Order.find();
      response.status(200).json(orders);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  if (method === "POST") {
    try {
      const order = await Order.create(request.body);
      response.status(201).json(order);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}
