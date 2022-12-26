import styles from "../../styles/Product.module.css";
import Image from "next/legacy/image";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";

const Product = ({ pizza }) => {
  const [price, setPrice] = useState(pizza.prices[0]);
  const [priceSize, setPriceSize] = useState(0);
  const [quantity, setQuantity] =  useState(1)
  const [extras, setExtras] = useState([]);
  const dispatch = useDispatch();
  // const pizza = {
  //   id: 1,
  //   img: "/img/pizza.png",
  //   name: "CAMPAGNOLA",
  //   price: [19.9, 23.9, 27.9],
  //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis arcu purus, rhoncus fringilla vestibulum vel, dignissim vel ante. Nulla facilisi. Nullam a urna sit amet tellus pellentesque egestas in in ante.",
  // };

  const changePrice = (number) => {
    return setPrice(price + number);
  };

  const handlePriceSize = (priceIndex) => {
    const difference = Math.abs(pizza.prices[priceIndex] - pizza.prices[priceSize]); // e.g  $13 -$12
    setPriceSize(difference);
    return changePrice(difference);
  };

  const handleChange = (event, option) => {
    const checked = event.target.checked;

    if (checked) {
      changePrice(option.price);
     // setExtras((prev) => [...prev, option]);
     setExtras([...extras, option])
    } else {
      changePrice(-option.price);
      setExtras(extras.filter((extra) => extra._id !== option._id));
    }
  };

  const handleClick = () =>{
     dispatch(addProduct({ ...pizza, extras, price, quantity}))
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={pizza.img} alt="" layout="fill" objectFit="contain" />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price}</span>
        <p className={styles.desc}>{pizza.desc}</p>
        <h3 className={styles.choose}>Choose your price</h3>
        <div className={styles.pricess}>
          <div className={styles.prices} onClick={() => handlePriceSize(0)}>
            <Image src="/img/size.png" alt="" layout="fill" />
            <span className={styles.number}>Small</span>
          </div>
          <div className={styles.prices} onClick={() => handlePriceSize(1)}>
            <Image src="/img/size.png" alt="" layout="fill" />
            <span className={styles.number}>Medium</span>
          </div>
          <div className={styles.prices} onClick={() => handlePriceSize(2)}>
            <Image src="/img/size.png" alt="" layout="fill" />
            <span className={styles.number}>Large</span>
          </div>
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {pizza.extraOptions.map((option) => (
            <div className={styles.option} key={option._id}>
              <input
                className={styles.checkbox}
                type="checkbox"
                name={option.text}
                id={option.text}
                onChange={(event) => handleChange(event, option)}
              />
              <label htmlFor="double">{option.text}</label>
            </div>
          ))}
        </div>
        <div className={styles.add}>
          <input type="number" className={styles.quantity} defaultValue={1} min={1} onChange={(event) => setQuantity(event.target.value)}/>
          <button className={styles.button} onClick={ handleClick}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const response = await axios.get(
    `http://localhost:3000/api/products/${params.id}`
  );
  return {
    props: {
      pizza: response.data,
    },
  };
};

export default Product;
