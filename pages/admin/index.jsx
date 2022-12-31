import Image from "next/legacy/image";
import styles from "../../styles/Admin.module.css";
import axios from "axios";
import { useState } from "react";

const Index = ({ orders, products }) => {
  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);

  const handleDelete = async (id) => {
    try {
      await axios.delete("https://pizza-resturant-app.netlify.app/api/products/" + id);
      setPizzaList(pizzaList.filter((pizza) => pizza._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const status = ["Preparing", "On the way", "Delivered"];

  const handleChangeStatus = async (id) => {
    //First, you need to get the current status  of the  order from database
    const item = orderList.filter((order) => order._id === id)[0].status;
    // console.log(item);
    const currentStatus = item;
    const response = await axios.put("https://pizza-resturant-app.netlify.app/api/orders/" + id, {
      status: currentStatus + 1,
    });
    setOrderList([
      response.data,
      ...orderList.filter((order) => order._id !== id),
    ]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Product</h1>
        <table className={styles.table}>
          <thead>
            <tr className={styles.trTitle}>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          {pizzaList.map((product) => (
            <tbody key={product._id}>
              <tr className={styles.tr}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={product.img}
                      alt=""
                      width="50px"
                      height="50px"
                      objectFit="cover"
                    />
                  </div>
                </td>
                <td>
                  <span>{product._id.slice(0, 5)}...</span>
                </td>
                <td>
                  <span>{product.title}</span>
                </td>
                <td>
                  <span className={styles.price}>${product.prices[0]}</span>
                </td>
                <td>
                  <button className={styles.button}>Edit</button>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>Order</h1>
        <table className={styles.table}>
          <thead>
            <tr className={styles.trTitle}>
              <th>Id</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {orderList.map((order) => (
            <tbody key={order._id}>
              <tr className={styles.tr}>
                <td>{order._id.slice(0, 5)}...</td>
                <td>
                  <span>{order.customer}</span>
                </td>
                <td>
                  <span>${order.total}</span>
                </td>
                <td>
                  <span>
                    {order.paymentMethod === 0 ? (
                      <span>Cash</span>
                    ) : (
                      <span>Paid</span>
                    )}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>{status[order.status]}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleChangeStatus(order._id)}
                    className={styles.statusButton}
                  >
                    Next Stage
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";

  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  const productRes = await axios.get("https://pizza-resturant-app.netlify.app/api/products");
  const orderRes = await axios.get("https://pizza-resturant-app.netlify.app/api/orders");

  return {
    props: {
      products: productRes.data,
      orders: orderRes.data,
    },
  };
};

export default Index;
