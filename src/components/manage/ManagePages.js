import SuccessIcon from "../../assets/img/Yes.png";
import YouSure from "../../assets/img/vineboom.jpeg";
import ImDead from "../../assets/img/graaahh.jpeg";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { AppDataContext } from "../../providers/AppDataProvider";
import SearchBar from "../SearchBar";
import { Outlet, useNavigate, useParams } from "react-router";
import PopupMessage from "../PopupMessage";
import NumberSelector from "../NumberSelector";

function ManageWelcome() {
  const { userData, setUserData } = useContext(UserContext);

  return (
    <>
      <div className="panel">
        <h2 style={{ textAlign: "center", color: "var(--tertiary-color)" }}>
          Selamat Datang, {userData.username}
        </h2>
      </div>
    </>
  );
}

function ManageStocks() {
  const { barang_id } = useParams();
  const navigate = useNavigate();
  const { appData, setAppData } = useContext(AppDataContext);

  const [search, setSearch] = useState("");
  const [items, setItems] = useState(appData.items);

  function handleSearch() {
    if (!search) {
      setItems(appData.items);
      return;
    }

    setItems(
      appData.items.filter((i) =>
        i.nama_barang.toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  useEffect(() => {
    setItems(appData.items);
  }, [appData.items]);

  return (
    <>
      <div className="panel manage-content">
        <h3>List Barang</h3>

        {!barang_id ? (
          <>
            <div className="manage-toolbar">
              <SearchBar
                placeholder={"Cari Nama Barang"}
                data={search}
                setData={setSearch}
                // style={{ marginTop: "1em", marginBottom: "1em" }}
                action={handleSearch}
              />

              <button onClick={() => navigate("/manage/stock/add")}>
                Tambah Barang
              </button>
            </div>

            {items.length > 0 ? (
              <table className="manage-table">
                <thead>
                  <th>ID Barang</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Jumlah Stock</th>
                  <th>Actions</th>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{item.item_id}</td>
                        <td>{item.nama_barang}</td>
                        <td>{item.kategori}</td>
                        <td>{item.stok}</td>
                        <td>
                          <button
                            className="secondary-btn"
                            onClick={() =>
                              navigate("/manage/stock/" + item.item_id)
                            }
                          >
                            Ubah
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <h3>Barang Tidak Ditemukan</h3>
            )}
          </>
        ) : (
          <StockDetails
            barang_id={barang_id}
            appData={appData}
            setAppData={setAppData}
          />
        )}
      </div>
    </>
  );
}
function StockDetails({ barang_id, appData, setAppData }) {
  const navigate = useNavigate();

  const [itemData, setItemData] = useState(
    appData.items.find((i) => i.item_id === barang_id)
  );
  const [newStock, setNewStock] = useState(0);
  const [changeConfirm, setChangeConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  function handleUpdate() {
    let newItems = appData.items;
    newItems[newItems.findIndex((ni) => ni.item_id === barang_id)].stok =
      newStock;

    setAppData({ ...appData, items: newItems });
    setItemData(newItems.find((i) => i.item_id === barang_id));
  }

  useEffect(() => {
    setNewStock(parseInt(itemData.stok));
  }, [itemData]);

  return (
    <>
      {changeConfirm ? (
        <PopupMessage
          message={"Konfirmasi Perubahan Jumlah Stock"}
          image={YouSure}
          buttons={[
            {
              display: "Konfirmasi",
              action: () => {
                handleUpdate();
                setChangeConfirm(false);
              },
            },
            {
              display: "Batal",
              action: () => setChangeConfirm(false),
            },
          ]}
        />
      ) : null}

      {hasChanged ? (
        <PopupMessage
          message={"Jumlah Stock Telah diganti"}
          image={SuccessIcon}
          buttons={[
            {
              display: "Kembali ke List",
              action: () => {
                navigate("/manage/stock");
              },
            },
            {
              display: "Tutup",
              action: () => setHasChanged(false),
            },
          ]}
        />
      ) : null}

      {deleteConfirm ? (
        <PopupMessage
          message={"Apakah Anda Ingin Menghapus Barang Ini?"}
          image={ImDead}
          buttons={[
            {
              display: "Iya",
              action: () => {
                setAppData({
                  ...appData,
                  orderItems: appData.orderItems.filter(
                    (oi) => oi.id_barang !== barang_id
                  ),
                  items: appData.items.filter((i) => i.item_id != barang_id),
                });

                navigate("/manage/stock");
              },
            },
            {
              display: "Tidak",
              action: () => setDeleteConfirm(false),
            },
          ]}
        />
      ) : null}

      <h2>Menampilkan Barang {barang_id}</h2>

      {itemData ? (
        <div style={{ marginBottom: "1.5em" }}>
          <p>ID Barang: {itemData.item_id}</p>
          <p>Nama Barang: {itemData.nama_barang}</p>
          <p>Kategori Barang: {itemData.kategori}</p>
          <p>
            Harga Barang:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(itemData.harga)}
          </p>
          <p>Stok Tersedia: {itemData.stok}</p>
        </div>
      ) : null}

      <p>Ubah Jumlah Stok</p>
      <div style={{ minWidth: "300px", width: "25%", marginBottom: "3em" }}>
        <NumberSelector data={newStock} setData={setNewStock} />
      </div>

      <button
        style={{ marginRight: "1em" }}
        onClick={() => setChangeConfirm(true)}
      >
        Ubah Jumlah Stock
      </button>
      <button
        style={{ marginRight: "1em" }}
        onClick={() => setDeleteConfirm(true)}
      >
        Hapus Barang
      </button>
      <button
        style={{ marginRight: "1em" }}
        onClick={() => navigate("/manage/stock")}
      >
        Kembali ke List
      </button>
    </>
  );
}

function AddStock() {
  const navigate = useNavigate();
  const { appData, setAppData } = useContext(AppDataContext);

  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Alami");
  const [stockInput, setStockInput] = useState();

  const [hasAdded, setHasAdded] = useState(false);

  function handleSubmit() {
    let biggestItemId = 0;
    if (appData.items.length > 0) {
      appData.items.forEach((i) => {
        if (i.item_id >= biggestItemId) biggestItemId = i.item_id;
      });
    }

    let newItems = appData.items;
    newItems.push({
      item_id: parseInt(biggestItemId) + 1,
      nama_barang: nameInput,
      kategori: categoryInput,
      stok: parseInt(stockInput),
    });

    setAppData({ ...appData, items: newItems });
    setHasAdded(true);
  }

  return (
    <>
      {hasAdded ? (
        <PopupMessage
          message={"Barang Baru Telah Ditambahkan"}
          image={SuccessIcon}
          buttons={[
            {
              display: "Tutup",
              action: () => setHasAdded(false),
            },
            {
              display: "Kembali ke List",
              action: () => navigate("/manage/stock"),
            },
          ]}
        />
      ) : null}

      <div className="panel manage-content">
        <h3 style={{ marginBottom: "1em" }}>Form Tambah Barang</h3>

        <div className="auth-form">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Nama Barang"
          />
          <select
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          >
            <option value={"Alami"}>Alami</option>
            <option value={"Sintetis"}>Sintetis</option>
          </select>
          <input
            type="number"
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value)}
            placeholder="Jumlah Stok"
          />

          <button onClick={handleSubmit}>Tambah Barang</button>
          <button onClick={() => navigate("/manage/stock")}>
            Kembali ke List
          </button>
        </div>
      </div>
    </>
  );
}

function ManageTransactions() {
  const { trans_id } = useParams();
  const navigate = useNavigate();
  const { appData, setAppData } = useContext(AppDataContext);

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(appData.orders);

  function handleSearch() {
    if (!search) {
      setOrders(appData.orders);
      return;
    }

    setOrders(appData.orders.filter((o) => o.id_transaksi == search));
  }

  return (
    <>
      <div className="panel manage-content">
        <h3>List Transaksi Konsumen</h3>

        {!trans_id ? (
          orders.length > 0 ? (
            <>
              <SearchBar
                placeholder={"Cari Transaksi"}
                data={search}
                setData={setSearch}
                action={handleSearch}
                style={{ marginBottom: "1em", marginTop: "1em" }}
              />

              <table className="manage-table">
                <thead>
                  <th>ID Transaksi</th>
                  <th>ID Konsumen</th>
                  <th>Tanggal Transaksi</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                  <th>Action</th>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    return (
                      <tr key={i}>
                        <td>{o.id_transaksi}</td>
                        <td>{o.id_konsumen}</td>
                        <td>{o.tanggal_transaksi}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(o.total_harga)}
                        </td>
                        <td>{o.status_validasi}</td>
                        <td>
                          <button
                            onClick={() => {
                              navigate("/manage/transaksi/" + o.id_transaksi);
                            }}
                          >
                            Lihat
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <SearchBar
                placeholder={"Cari Transaksi"}
                data={search}
                setData={setSearch}
                action={handleSearch}
                style={{ marginBottom: "1em", marginTop: "1em" }}
              />
              <h3>Tidak ada Pesanan Ditemukan</h3>
            </>
          )
        ) : (
          <TransactionDetails
            trans_id={trans_id}
            appData={appData}
            setAppData={setAppData}
          />
        )}
      </div>
    </>
  );
}

function TransactionDetails({ trans_id, appData, setAppData }) {
  const { userData, setUserData } = useContext(UserContext);

  const [transactionDetail, setTransactionDetail] = useState();
  const [transactionItems, setTransactionItems] = useState([]);

  const [yesValid, setYesValid] = useState(false);
  const [cantValidate, setCantValidate] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTransactionDetail(
      appData.orders.find((o) => o.id_transaksi == trans_id)
    );
    setTransactionItems(
      appData.orderItems.filter((i) => i.id_transaksi == trans_id)
    );
  }, []);

  useEffect(() => {
    transactionItems.forEach((ti) => {
      if (
        appData.items.find((i) => i.item_id === ti.id_barang).stok <
          ti.kuantitas ||
        transactionDetail.status_validasi === "Valid"
      )
        setCantValidate(true);
    });
  }, [transactionItems]);

  function validify() {
    let newOrders = appData.orders;
    newOrders[
      newOrders.findIndex((o) => o.id_transaksi == trans_id)
    ].status_validasi = "Valid";

    setAppData({ ...appData, orders: newOrders });

    setCantValidate(true);

    setHasValidated(true);
  }

  function makeRequest(barang_id, qty) {
    let biggestOrderId = 0;
    if (appData.supplyOrders.length > 0) {
      appData.supplyOrders.forEach((so) => {
        if (so.id_pemesanan >= biggestOrderId) biggestOrderId = so.id_pemesanan;
      });
    }

    const now = new Date();
    const newSupplyOrder = {
      id_pemesanan: biggestOrderId + 1,
      id_user: userData.user_id,
      id_barang: barang_id,
      kuantitas: qty,
      tanggal_pemesanan: `${now.getDate()}-${
        now.getMonth() + 1
      }-${now.getFullYear()}`,
      status_pemesanan: "Pending",
    };

    setAppData({
      ...appData,
      supplyOrders: [...appData.supplyOrders, newSupplyOrder],
    });

    setHasOrdered(true);
  }

  return (
    <>
      {yesValid ? (
        <PopupMessage
          message={"Apakah Anda Yakin ingin Memvalidasi Transaksi Ini?"}
          image={YouSure}
          buttons={[
            {
              display: "Iya",
              action: () => {
                validify();
                setYesValid(false);
              },
            },
            {
              display: "Tidak",
              action: () => {
                setYesValid(false);
              },
            },
          ]}
        />
      ) : null}

      {hasValidated ? (
        <PopupMessage
          message={"Transaksi Berhasil Tervalidasi"}
          image={SuccessIcon}
          buttons={[
            {
              display: "Okay",
              action: () => setHasValidated(false),
            },
          ]}
        />
      ) : null}

      {hasOrdered ? (
        <PopupMessage
          message={"Pesanan Tambah Stok Telah Diajukan"}
          image={SuccessIcon}
          buttons={[
            {
              display: "Okay",
              action: () => setHasOrdered(false),
            },
          ]}
        />
      ) : null}

      <h2>Menampilkan Transaksi {trans_id}</h2>

      {transactionDetail ? (
        <div style={{ marginBottom: "1.5em" }}>
          <p>ID Transaksi: {transactionDetail.id_transaksi}</p>
          <p>ID Pembeli: {transactionDetail.id_konsumen}</p>
          <p>Tanggal Transaksi: {transactionDetail.tanggal_transaksi}</p>
          <p>Status: {transactionDetail.status_validasi}</p>
        </div>
      ) : null}

      <p>Barang Pembelian</p>
      <table className="manage-table" style={{ marginBottom: "2em" }}>
        <thead>
          <th>ID Barang</th>
          <th>Nama Barang</th>
          <th>Kuantitas</th>
          <th>Stock Barang</th>
          <th>Harga Satuan</th>
          <th>Harga Total</th>
          <th>Diskon</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {transactionItems.map((t, i) => {
            return (
              <tr key={i}>
                <td>{t.id_barang}</td>
                <td>
                  {
                    appData.items.find((i) => i.item_id === t.id_barang)
                      .nama_barang
                  }
                </td>
                <td>{t.kuantitas}</td>
                <td>
                  {appData.items.find((i) => i.item_id === t.id_barang).stok}
                </td>
                <td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(t.harga_satuan)}
                </td>
                <td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(t.harga_satuan * t.kuantitas)}
                </td>
                <td>{t.diskon}</td>
                <td>
                  {appData.items.find((i) => i.item_id === t.id_barang).stok <
                  t.kuantitas ? (
                    <button
                      className="secondary-btn"
                      style={{ color: "red" }}
                      onClick={() =>
                        makeRequest(
                          t.id_barang,
                          appData.items.find((i) => i.item_id === t.id_barang)
                            .stok - t.kuantitas
                        )
                      }
                    >
                      Tambah Stock
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!cantValidate ? (
        <button
          onClick={() => setYesValid(true)}
          style={{ marginRight: "1em" }}
        >
          Validasi Pesanan
        </button>
      ) : null}

      <button onClick={() => navigate("/manage/transaksi")}>
        Kembali ke List
      </button>
    </>
  );
}

function ManageReport() {}

function ManageSupply() {
  const { appData, setAppData } = useContext(AppDataContext);

  function handleComplete(id_pemesanan, id_barang, qtyToAdd) {
    let newSupplyOrder = appData.supplyOrders;
    newSupplyOrder[
      appData.supplyOrders.findIndex((so) => so.id_pemesanan === id_pemesanan)
    ].status_pemesanan = "Selesai";

    let newItems = appData.items;
    newItems[newItems.findIndex((i) => i.item_id === id_barang)].stok +=
      qtyToAdd;

    setAppData({ ...appData, items: newItems, supplyOrders: newSupplyOrder });
  }

  return (
    <>
      <div className="panel manage-content">
        <h3 style={{ marginBottom: "2em" }}>
          List Permintaan Pesanan Persediaan
        </h3>

        {appData.supplyOrders.length > 0 ? (
          <table className="manage-table">
            <thead>
              <th>ID Pesanan</th>
              <th>ID Pembuat Pesan</th>
              <th>ID Barang</th>
              <th>Jumlah yang Dipesan</th>
              <th>Tanggal Pemesanan</th>
              <th>Status</th>
              <th>Actions</th>
            </thead>
            <tbody>
              {appData.supplyOrders.map((so, i) => {
                return (
                  <tr key={i}>
                    <td>{so.id_pemesanan}</td>
                    <td>{so.id_user}</td>
                    <td>{so.id_barang}</td>
                    {/* FIXME: Just making it absolute for now uuuguuuguhguhguhguhguhguhguhgu */}
                    <td>{Math.abs(so.kuantitas)}</td>
                    <td>{so.tanggal_pemesanan}</td>
                    <td>{so.status_pemesanan}</td>
                    <td>
                      {so.status_pemesanan === "Pending" ? (
                        <button
                          className="secondary-btn"
                          onClick={() =>
                            handleComplete(
                              so.id_pemesanan,
                              so.id_barang,
                              Math.abs(so.kuantitas)
                            )
                          }
                        >
                          Selesaikan
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h3>Tidak Ada Permintaan Persediaan Pesanan</h3>
        )}
      </div>
    </>
  );
}

function ManageUsers() {
  const navigate = useNavigate();
  const { appData, setAppData } = useContext(AppDataContext);

  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState(appData.users);
  const [deleteTarget, setDeleteTarget] = useState();

  function handleSearch() {
    if (!userSearch) {
      setUsers(appData.users);
      return;
    }

    setUsers(
      appData.users.filter((u) =>
        u.username.toLowerCase().includes(userSearch.toLowerCase())
      )
    );
  }

  function handleDelete() {
    const newUsers = appData.users.filter((u) => u.id_user !== deleteTarget);
    const newOrders = appData.orders.filter(
      (o) => o.id_konsumen !== deleteTarget
    );
    const newSupplyOrders = appData.supplyOrders.filter(
      (so) => so.id_user !== deleteTarget
    );

    setAppData({
      ...appData,
      users: newUsers,
      orders: newOrders,
      supplyOrders: newSupplyOrders,
    });

    setDeleteTarget(undefined);
  }

  useEffect(() => {
    setUsers(appData.users);
  }, [appData.users]);

  return (
    <>
      {deleteTarget ? (
        <PopupMessage
          message={"Apakah Anda Yakin Ingin Menghapus Akun?"}
          image={ImDead}
          buttons={[
            {
              display: "Iya",
              action: () => handleDelete(),
            },
            {
              display: "Tidak",
              action: () => setDeleteTarget(undefined),
            },
          ]}
        />
      ) : null}

      <div className="panel manage-content">
        <h3 style={{ marginBottom: "1em" }}>List Akun Pengguna</h3>

        <div className="manage-toolbar">
          <SearchBar
            data={userSearch}
            setData={setUserSearch}
            placeholder={"Cari Nama Akun"}
            action={handleSearch}
          />

          <button onClick={(e) => navigate("/manage/users/add")}>
            Tambah Akun
          </button>
        </div>

        {users.length > 0 ? (
          <table className="manage-table">
            <thead>
              <th>ID User</th>
              <th>Username</th>
              <th>Password</th>
              <th>Role</th>
              <th>Actions</th>
            </thead>
            <tbody>
              {users.map((u, i) => {
                return (
                  <tr key={i}>
                    <td>{u.id_user}</td>
                    <td>{u.username}</td>
                    <td>{u.password}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className="secondary-btn"
                        onClick={() => setDeleteTarget(u.id_user)}
                      >
                        Hapus User
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h3>Data akun tidak ditemukan</h3>
        )}
      </div>
    </>
  );
}

function AddUser() {
  const navigate = useNavigate();
  const { appData, setAppData } = useContext(AppDataContext);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const [hasAdded, setHasAdded] = useState(false);

  function handleSubmit() {
    if (!usernameInput || !passwordInput || !roleInput) {
      alert("Semua field harus terisi!");
      return;
    }

    let biggestUserId = 0;
    if (appData.users.length > 0) {
      appData.users.forEach((u) => {
        if (u.id_user > biggestUserId) biggestUserId = u.id_user;
      });
    }

    let newUsers = appData.users;
    newUsers.push({
      id_user: biggestUserId + 1,
      username: usernameInput,
      password: passwordInput,
      role: roleInput,
    });
    setAppData({ ...appData, users: newUsers });

    setHasAdded(true);
  }

  return (
    <>
      {hasAdded ? (
        <PopupMessage
          message={"Akun Baru Telah Dibuat"}
          image={SuccessIcon}
          buttons={[
            {
              display: "Tutup",
              action: () => setHasAdded(false),
            },
            {
              display: "Kembali ke List",
              action: () => navigate("/manage/users"),
            },
          ]}
        />
      ) : null}

      <div className="panel manage-content">
        <h3 style={{ marginBottom: "1em" }}>Form Tambah User</h3>

        <div className="auth-form">
          <input
            type="text"
            value={usernameInput}
            placeholder="Username"
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            type="password"
            value={passwordInput}
            placeholder="Buat Password"
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <select
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
          >
            <option value={"Admin"}>Admin</option>
            <option value={"Gudang"}>Gudang</option>
            <option value={"Kasir"}>Kasir</option>
            <option value={"Supplier"}>Supplier</option>
          </select>

          <button onClick={handleSubmit}>Tambah User</button>
          <button onClick={(e) => navigate("/manage/users")}>
            Kembali ke List
          </button>
        </div>
      </div>
    </>
  );
}

export {
  ManageWelcome,
  ManageStocks,
  AddStock,
  ManageTransactions,
  ManageReport,
  ManageSupply,
  ManageUsers,
  AddUser,
};
