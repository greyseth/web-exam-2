import Checkmark from "../../assets/img/checkmark.png";

import { useNavigate, useParams } from "react-router-dom";
import LoginChecker from "../../LoginChecker";
import Header from "../Header";
import NumberSelector from "../NumberSelector";
import { useContext, useEffect, useState } from "react";
import { AppDataContext } from "../../providers/AppDataProvider";
import { UserContext } from "../../providers/UserProvider";
import PopupMessage from "../PopupMessage";

function ItemDetails() {
  const { item_id } = useParams();
  const navigate = useNavigate();
  const { appData, setAppData } = useContext(AppDataContext);
  const { userData, setUserData } = useContext(UserContext);

  const [itemData, setItemData] = useState({});
  const [orderAmount, setOrderAmount] = useState(0);
  const [hasOrdered, setHasOrdered] = useState(false);

  useEffect(() => {
    const getItem = appData.items.filter((i) => i.item_id === item_id);
    if (getItem.length > 0) setItemData(getItem[0]);
    else navigate("/");
  }, []);

  function handleOrder() {
    //Idk how payment is supposed to be handled grraaaahhhh

    const newAppData = appData;

    let biggestOrderItemId = 0;
    if (newAppData.cartItems.length > 0) {
      newAppData.cartItems.forEach((item) => {
        if (item.id_detail >= biggestOrderItemId)
          biggestOrderItemId = item.id_detail;
      });
    }

    newAppData.cartItems.push({
      id_detail: biggestOrderItemId + 1,
      id_transaksi: undefined,
      id_barang: itemData.item_id,
      id_user: userData.user_id,
      kuantitas: orderAmount,
      harga_satuan: itemData.harga,
      diskon: 0,
    });

    setAppData(newAppData);
    setHasOrdered(true);
  }

  return (
    <>
      <LoginChecker />
      <Header />

      {hasOrdered ? (
        <PopupMessage
          image={Checkmark}
          message={"Barang Telah Ditambahkan ke Keranjang"}
          buttons={[
            {
              action: () => {
                navigate("/");
              },
              display: "Lanjut Belanja",
            },
            {
              action: () => {
                navigate("/cart");
              },
              display: "Lihat Keranjang",
            },
          ]}
        />
      ) : null}

      <section className="item-details-container">
        <div className="panel">
          <p className="item-card-name">{itemData.nama_barang}</p>
          <p className="item-card-cat">{itemData.kategori}</p>
          <p className="item-card-price">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(itemData.harga)}
          </p>
        </div>
        <div className="item-order panel">
          <h2>Pesan</h2>

          <NumberSelector data={orderAmount} setData={setOrderAmount} />

          {orderAmount > 0 ? (
            <p>
              Total:{" "}
              <b>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(itemData.harga * orderAmount)}
              </b>
            </p>
          ) : null}
          <button
            disabled={orderAmount <= 0}
            className={orderAmount > 0 ? null : "disabled"}
            onClick={handleOrder}
          >
            Buat Pesanan
          </button>
        </div>
      </section>

      <button
        className="secondary-btn"
        style={{ marginLeft: "1.5em", marginTop: "1.5em" }}
        onClick={() => {
          navigate("/");
        }}
      >
        Kembali Ke List
      </button>
    </>
  );
}

export default ItemDetails;
