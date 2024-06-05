import { useContext } from "react";
import "../../assets/css/items.css";
import { AppDataContext } from "../../providers/AppDataProvider";
import { useNavigate } from "react-router";

function ItemsList() {
  const { appData, setAppData } = useContext(AppDataContext);

  return (
    <ul className="items-list">
      {appData.items.map((item, i) => (
        <ItemCard item={item} key={i} />
      ))}
    </ul>
  );
}

function ItemCard({ item }) {
  const navigate = useNavigate();

  function handleRedirect(itemId) {
    navigate("/item/" + itemId);
  }

  return (
    <li>
      <div
        className="item-card panel point-hover"
        tabIndex={0}
        onClick={() => handleRedirect(item.item_id)}
      >
        <p className="item-card-name">{item.nama_barang}</p>
        <p className="item-card-cat">{item.kategori}</p>
        <p className="item-card-price">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(item.harga)}
        </p>
      </div>
    </li>
  );
}

export default ItemsList;
