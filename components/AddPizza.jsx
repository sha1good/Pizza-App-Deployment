import styles from "../styles/AddPizza.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const AddPizza = ({ setClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [prices, setPrices] = useState([]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [extra, setExtra] = useState(null);
  const router = useRouter();

  const changePrice = (event, index) => {
    //setPrices([index]) = event.target.value;
    const currentPrices = prices;
    currentPrices[index] = event.target.value;
    setPrices(currentPrices);
  };

  const handleExtraInput = (event) => {
    setExtra({ ...extra, [event.target.name]: event.target.value });
  };

  const handleExtra = (event) => {
    setExtraOptions([...extraOptions, extra]);
    //setExtraOptions((prev) => [...prev,extra])
  };

  const handleCreate = async () => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "sheriff");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/drwa2jhdf/image/upload",
        formdata
      );
      const { url } = uploadRes.data;
      const newProduct = {
        title,
        desc,
        prices,
        extraOptions,
        img: url,
      };
      await axios.post("http://localhost:3000/api/products", newProduct);
      setClose(true);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span className={styles.close} onClick={() => setClose(true)}>
          X
        </span>
        <h1 className={styles.title}>Add a new Pizza</h1>
        <div className={styles.item}>
          <label className={styles.label}>Choose a Pizza Image</label>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files[0])}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Desc</label>
          <textarea
            rows={4}
            type="text"
            onChange={(event) => setDesc(event.target.value)}
            className={styles.textarea}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Prices</label>
          <div className={styles.priceContainer}>
            <input
              type="number"
              placeholder="small"
              onChange={(event) => changePrice(event, 0)}
              className={`${styles.input} ${styles.inputSm}`}
            />
            <input
              type="number"
              placeholder="Medium"
              onChange={(event) => changePrice(event, 1)}
              className={`${styles.input} ${styles.inputSm}`}
            />
            <input
              type="number"
              placeholder="Large"
              onChange={(event) => changePrice(event, 2)}
              className={`${styles.input} ${styles.inputSm}`}
            />
          </div>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Extra</label>
          <div className={styles.extra}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="text"
              placeholder="Item"
              name="text"
              onChange={handleExtraInput}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Price"
              name="price"
              onChange={handleExtraInput}
            />
            <button className={styles.extraButton} onClick={handleExtra}>
              AddExtra
            </button>
          </div>
        </div>
        <div className={styles.extraOptions}>
          {extraOptions.map((option) => (
            <span className={styles.extraOption} key={option.text}>
              {option.text}
            </span>
          ))}
        </div>
        <button className={styles.addButton} onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
};

export default AddPizza;
