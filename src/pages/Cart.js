import Checkmark from "../assets/img/checkmark.png";
import "../assets/css/cart.css";

import LoginChecker from "../LoginChecker";
import Header from "../components/Header";
import NumberSelector from "../components/NumberSelector";
import { useContext, useEffect, useState } from "react";
import { AppDataContext } from "../providers/AppDataProvider";
import { UserContext } from "../providers/UserProvider";
import { useNavigate } from "react-router";
import PopupMessage from "../components/PopupMessage";

function Cart() {
  const { userData, setUserData } = useContext(UserContext);
  const { appData, setAppData } = useContext(AppDataContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [hasOrdered, setHasOrdered] = useState(false);

  useEffect(() => {
    const newCartItems = appData.cartItems.filter(
      (c) => c.id_user === userData.user_id && c.kuantitas > 0
    );
    setCartItems(newCartItems);
  }, []);

  useEffect(() => {
    let totalSum = 0;
    cartItems.forEach((ci) => {
      totalSum += parseInt(ci.harga_satuan) * ci.kuantitas;
    });
    setGrandTotal(totalSum);
  }, [cartItems]);

  function handleOrder() {
    let newOrderItems = appData.orderItems;
    let newOrders = appData.orders;

    let biggestOrderId = 0;
    if (newOrders.length > 0) {
      newOrders.forEach((order) => {
        if (order.id_transaksi >= biggestOrderId)
          biggestOrderId = order.id_transaksi;
      });
    }

    const now = new Date();
    newOrders.push({
      id_transaksi: biggestOrderId + 1,
      id_konsumen: userData.user_id,
      tanggal_transaksi: `${now.getDate()}-${
        now.getMonth() + 1
      }-${now.getFullYear()}`,
      total_harga: grandTotal,
      status_validasi: "Tidak Valid",
    });

    appData.cartItems.forEach((ci) => {
      if (ci.id_user === userData.user_id)
        newOrderItems.push({ ...ci, id_transaksi: biggestOrderId + 1 });
    });

    const newCartItems = appData.cartItems.filter(
      (ci) => ci.id_user !== userData.user_id
    );
    setAppData({
      ...appData,
      cartItems: newCartItems,
      orders: newOrders,
      orderItems: newOrderItems,
    });

    setHasOrdered(true);
  }

  return (
    <>
      <LoginChecker />

      <Header />

      {hasOrdered ? (
        <PopupMessage
          image={Checkmark}
          message={"Pesanan Telah Diajukan"}
          buttons={[
            {
              action: () => {
                navigate("/");
              },
              display: "Lanjut Belanja",
            },
          ]}
        />
      ) : null}

      <section className="cart-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              color: "var(--tertiary-color)",
            }}
          >
            Keranjang Anda
          </h2>
          <div>
            <button
              className="secondary-btn"
              onClick={handleOrder}
              style={{ marginRight: "1em" }}
            >
              Pesan
            </button>
            <button className="secondary-btn" onClick={() => navigate("/")}>
              Kembali
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1em",
          }}
        >
          <h2 style={{ color: "var(--tertiary-color)" }}>
            Total Harga Pesanan:{" "}
          </h2>
          <h2 style={{ color: "var(--tertiary-color)" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(grandTotal)}
          </h2>
        </div>

        <ul className="cart-list">
          {cartItems.length > 0 ? (
            cartItems.map((item, i) => (
              <CartItem
                itemIndex={item.id_detail}
                cartItems={cartItems}
                setCartItems={setCartItems}
                key={i}
              />
            ))
          ) : (
            <h1 style={{ textAlign: "center" }}>Tidak Ada Pesanan</h1>
          )}
        </ul>
      </section>
    </>
  );
}

function CartItem({ itemIndex, cartItems, setCartItems }) {
  const { appData, setAppData } = useContext(AppDataContext);

  const [itemData, setItemData] = useState();
  const [loadedData, setLoadedData] = useState(false);
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const newItemDataTemp = cartItems.find((ci) => ci.id_detail === itemIndex);
    const newItemData = appData.items.find(
      (id) => id.item_id === newItemDataTemp.id_barang
    );

    setItemData(newItemData);
    setQty(newItemDataTemp.kuantitas);
    setLoadedData(true);
  }, []);

  useEffect(() => {
    if (!loadedData) return;

    // Apparently i have to use map???
    let newCartItems = cartItems.map((nci, i) => {
      if (nci.id_detail === itemIndex) {
        return { ...nci, kuantitas: qty };
      } else return nci;
    });
    newCartItems = newCartItems.filter((nci) => {
      return parseInt(nci.kuantitas) > 0;
    });
    setCartItems(newCartItems);
  }, [qty]);

  return (
    <li className="panel">
      {itemData ? (
        <>
          <h2>{itemData.nama_barang}</h2>
          <NumberSelector data={qty} setData={setQty} />
          <p>
            Satuan:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(itemData.harga)}
          </p>
          <p>
            Total:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(itemData.harga * qty)}
          </p>
        </>
      ) : (
        <h2>Loading Cart Item...</h2>
      )}
    </li>
  );
}

export default Cart;
