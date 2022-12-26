import dbConnect from "../../../util/mongoose";
import Order from "../../../models/Order";

export default async function handler(request, response) {
  const {
    method,
    query: { id },
  } = request;

  dbConnect();

  if (method === "GET") {
    try {
      const order = await Order.findById(id);
      response.status(200).json(order);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  if (method === "PUT") {
    try {
      const order = await Order.findByIdAndUpdate(id, request.body, {
        new: true,
      });
      response.status(200).json(order);
    } catch (error) {
      response.status(500).json(error);
    }
  }
  if (method === "DELETE") {
  }
}
