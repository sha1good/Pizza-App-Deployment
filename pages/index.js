import Head from "next/head";
import Featured from "../components/Featured";
import PizzaList from "../components/PizzaList";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import AddButton from "../components/AddButton";
import AddPizza from "../components/AddPizza";

export default function Home({ pizzaList, admin }) {
  const [close, setClose] = useState(true);
  return (
    <div className={styles}>
      <Head>
        <title>Sha1 Next App</title>
        <meta name="description" content="Pizza next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Featured />
      
      {admin && <AddButton setClose={setClose} />}
      <PizzaList pizzaList={pizzaList} />
      {!close && <AddPizza setClose={setClose} />}
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  let admin = false;

  if (myCookie.token === process.env.TOKEN) {
    admin = true;
  }

  const response = await axios.get("https://pizza-resturant-app.netlify.app/api/products");
  return {
    props: {
      pizzaList: response.data,
      admin,
    },
  };
};
