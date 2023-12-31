
import ReactDOM from "react-dom/client";
import "./css/bootstrap-extended.css";
import "./css/bootstrap.min.css";
import "./css/main.css";
import "./css/style.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export function Pickup() {
  const [code, setCode] = useState("");
  const [product, setProducts] = useState();
  const [cart, setCart] = useState();
  const [category, setCategory] = useState();
  const [staff, setStaff] = useState();
  const [uid, setUid] = useState();
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [loading0, setLoading0] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleLogout = () => {
    setLoading0(true);
    sessionStorage.removeItem("uid");
    setLoading0(false);
    window.location.href = "/";
    setUid();
  };


  // ฟังก์ชันเมื่อเลือกหมวดหมู่
  const handleSelectCategory = async (id) => {
    setSelectedCategory(id);
    await axios
      .post("https://stock.akhoocafe.cloud/manage/api/categorys.php", {
        cid: id,
      })
      .then((response) => response.data)
      .then((responseJson) => {
        console.log(responseJson);
        setProducts(responseJson);
      })
      .catch((error) => {
        Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
      });
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "https://stock.akhoocafe.cloud/manage/api/cart.php"
      );
      setCart(response.data);
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "https://stock.akhoocafe.cloud/manage/api/category.php"
      );
      setCategory(response.data);
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const uid = await sessionStorage.getItem("uid");
      axios
        .post("https://stock.akhoocafe.cloud/manage/api/staff.php", {
          code: uid,
        })
        .then((response) => response.data)
        .then((responseJson) => {
          setStaff(responseJson.user);
        })
        .catch((error) => {
          console.log("เกิดข้อผิดพลาด:", error);
        });
    } catch (error) {
      console.log("เกิดข้อผิดพลาด:", error);
    }
  };

  useEffect(() => {
    // สร้างฟังก์ชันที่ใช้ในการดึงข้อมูลสินค้าจาก API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://stock.akhoocafe.cloud/manage/api/product.php"
        );
        setProducts(response.data);
      } catch (error) {
        console.log("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
      }
    };
    const uid = sessionStorage.getItem("uid");
    if (uid) {
      setUid(uid);
    }
    // เรียกใช้ฟังก์ชันดึงข้อมูลสินค้า
    fetchProducts();
    fetchCart();
    fetchCategory();
    fetchStaff();
  }, []);

  const addToCart = (productId, quantity) => {
    setLoading(true);
    axios
      .post("https://stock.akhoocafe.cloud/manage/api/add_cart.php", {
        pid: productId,
        item: quantity,
      })
      .then((response) => response.data)
      .then((responseJson) => {
        setLoading(false);
        if (responseJson === "success") {
          console.log(responseJson);
          fetchCart();
        } else {
          console.log(responseJson);
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
      });
  };

  const UpdateCart = (productId, types) => {
    setLoading1(true);
    axios
      .post("https://stock.akhoocafe.cloud/manage/api/update_cart.php", {
        pid: productId,
        types: types,
      })
      .then((response) => response.data)
      .then((responseJson) => {
        setLoading1(false);
        if (responseJson === "success") {
          console.log(responseJson);
          fetchCart();
        } else {
          console.log(responseJson);
        }
      })
      .catch((error) => {
        setLoading1(false);
        Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
      });
  };

  const addPickup = async () => {
    let uid = await sessionStorage.getItem("uid");
    console.log(uid);
    Swal.fire({
      title: "ยืนยันการเบิกสินค้า?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่! ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios
          .post("https://stock.akhoocafe.cloud/manage/api/add_pickup.php", {
            uid: uid,
          })
          .then((response) => response.data)
          .then((responseJson) => {
            setLoading(false);
            if (responseJson === "success") {
              Swal.fire("สำเร็จ", "บันทึกการเบิกสินค้าสำเร็จ", "success");
              fetchCart();
            } else {
              console.log(responseJson);
            }
          })
          .catch((error) => {
            setLoading(false);
            Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
          });
      }
    });
  };

  console.log(searchResults);
  console.log(product);
  //console.log(sessionStorage.getItem("uid"));

  return uid ? (
    <div className="p-5">
      <div className="page-content-wrapper">
        <div className="page-content">
          <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
            <div className="breadcrumb-title pe-3">เบิกสินค้า</div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0 align-items-center">
                  <i className="fas fa-chevron-right "></i> &emsp;
                  <li className="breadcrumb-item active" aria-current="page">
                    เบิกสินค้า
                  </li>
                </ol>
              </nav>
            </div>
            <div className="ms-auto">
              <button
                type="button"
                onClick={() => handleLogout()}
                disabled={loading0}
                className="btn btn-success"
              >
                <i className="fas fa-sign-out-alt"></i> ออกจากระบบ
              </button>
            </div>
          </div>

          <section className="shop-page">
            <div className="shop-container">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row">
                    <div style={{ display: "flex", flexDirection: "row",paddingBottom:15 }}>
                      {selectedCategory != 0 ? (
                        <i
                          onClick={() => setSelectedCategory(0)}
                          style={{ paddingRight: 15, cursor: "pointer" }}
                          className="fas fa-arrow-left fa-2x"
                        ></i>
                      ) : null}
                      <h5>
                        หมวดหมู่ :{" "}
                        {category
                          ? category.map((c) => (
                              <span key={c.cid} value={c.cid}>
                                {c.cid == selectedCategory ? c.category : null}
                              </span>
                            ))
                          : null}
                      </h5>
                    </div>
                    <div className="col-3"></div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-xl-12">
                      <div className="product-wrapper">
                        
                        <div className="row">
                          <div className="col-9">
                            <div className="product-grid">
                              {selectedCategory != 0 ? (
                                <div
                                  className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"
                                  id="products-container"
                                >
                                  {product
                                    ? product.map((product) => (
                                        <div key={product.id} className="col">
                                          <div className="card product-card">
                                            <div className="card-header bg-transparent border-bottom-0">
                                              <div className="d-flex align-items-center justify-content-end"></div>
                                            </div>
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <img
                                                src={product.img_url}
                                                style={{
                                                  width: 100,
                                                  height: 100,
                                                }}
                                                className="card-img-top"
                                                alt="..."
                                              />
                                            </div>
                                            <div className="card-body">
                                              <div className="product-info">
                                                <h6 className="product-name mb-2">
                                                  {product.name}
                                                </h6>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                  }}
                                                >
                                                  <div className="product-price">
                                                    <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "blue",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      ฿ {product.price}
                                                    </span>
                                                  </div>
                                                  <span
                                                    style={{
                                                      fontSize: 16,
                                                      color: "skyblue",
                                                    }}
                                                  >
                                                    ({product.categorys})
                                                  </span>
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                  }}
                                                >
                                                  <span
                                                    style={{
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {product.code}
                                                  </span>
                                                  <span
                                                    style={{
                                                      fontWeight: "bold",
                                                      color: "salmon",
                                                    }}
                                                  >
                                                    ชั้น {product.shelf}
                                                  </span>
                                                </div>

                                                <div className=" mt-2">
                                                  <div className="row">
                                                    <div className="col-6">
                                                      <input
                                                        className=" form-control "
                                                        min="1"
                                                        id={`quantity_${product.id}`}
                                                        type="number"
                                                        defaultValue="1"
                                                      />
                                                    </div>
                                                    <div className="col-6">
                                                      <button
                                                        className="btn btn-primary "
                                                        onClick={() =>
                                                          addToCart(
                                                            product.id,
                                                            parseInt(
                                                              document.getElementById(
                                                                `quantity_${product.id}`
                                                              ).value
                                                            )
                                                          )
                                                        }
                                                        disabled={loading}
                                                      >
                                                        <i className="fas fa-plus"></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              ) : (
                                <div
                                  className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"
                                  id="products-container"
                                >
                                  {category
                                    ? category.map((product) => (
                                        <div
                                          key={product.cid}
                                          className="col"
                                          onClick={() => 
                                            handleSelectCategory(product.cid)
                                          }
                                          style={{ cursor: "pointer" }}
                                        >
                                          <div className="card product-card">
                                            <div className="card-header bg-transparent border-bottom-0">
                                              <div className="d-flex align-items-center justify-content-end"></div>
                                            </div>
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <img
                                                src={product.img_url}
                                                style={{
                                                  width: 100,
                                                  height: 100,
                                                }}
                                                className="card-img-top"
                                                alt="..."
                                              />
                                            </div>
                                            <div className="card-body">
                                              <div className="product-info">
                                                <h6 className="product-name mb-2">
                                                  {product.name}
                                                </h6>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                  }}
                                                >
                                                  <div className="product-price">
                                                    <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "blue",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {product.category}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-3">
                            <h5>รายการ</h5>
                            <hr />
                            <div id="cart-response">
                              <table className=" table table-striped">
                                <tbody>
                                  {cart
                                    ? cart.map((c) => (
                                        <tr key={c.id}>
                                          <td
                                            style={{ width: "70%" }}
                                            className=" align-middle"
                                          >
                                            <h6>{c.name}</h6>
                                          </td>
                                          <td className=" align-middle titles text-nowrap">
                                            <div style={{ padding: 5 }}>
                                              <span
                                                onClick={() =>
                                                  UpdateCart(c.idp, "minus")
                                                }
                                                style={{
                                                  backgroundColor: "#ddd",
                                                  padding: 5,
                                                  paddingLeft: 10,
                                                  paddingRight: 10,
                                                  borderRadius: "100%",
                                                  cursor: "pointer",
                                                  pointerEvents: loading1
                                                    ? "none"
                                                    : "auto", // ตั้งค่า pointerEvents เพื่อ disable ปุ่มเมื่อ quantity เป็น 1
                                                  opacity: loading1 ? 0.5 : 1,
                                                }}
                                              >
                                                <i className="fas fa-minus "></i>
                                              </span>
                                              <span style={{ fontSize: 18 }}>
                                                &nbsp;&nbsp;{c.item}&nbsp;&nbsp;
                                              </span>
                                              <span
                                                onClick={() =>
                                                  UpdateCart(c.idp, "plus")
                                                }
                                                style={{
                                                  backgroundColor: "#ddd",
                                                  padding: 5,
                                                  paddingLeft: 10,
                                                  paddingRight: 10,
                                                  borderRadius: "50%",
                                                  cursor: "pointer",
                                                  pointerEvents: loading1
                                                    ? "none"
                                                    : "auto", // ตั้งค่า pointerEvents เพื่อ disable ปุ่มเมื่อ quantity เป็น 1
                                                  opacity: loading1 ? 0.5 : 1,
                                                }}
                                              >
                                                <i className="fas fa-plus "></i>
                                              </span>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                    : null}
                                </tbody>
                              </table>
                              <h6>
                                <span style={{ fontWeight: "bold" }}>
                                  พนักงานเบิก:
                                </span>{" "}
                                {staff?.name} {staff?.last}{" "}
                                {staff?.nickname
                                  ? +"(" + staff.nickname + ")"
                                  : null}
                              </h6>

                              <div className="row">
                                <div className="col-12 "></div>
                                <div
                                  className="col-12 mt-3"
                                  style={{
                                    paddingTop: 5,
                                    textAlign: "center",
                                  }}
                                >
                                  {cart ? (
                                    loadings ? (
                                      <button
                                        type="submit"
                                        name="btn_login"
                                        className="btn btn-primary titles"
                                        disabled
                                      >
                                        <i className="fas fa-spinner fa-spin"></i>{" "}
                                        กำลังบันทึก
                                      </button>
                                    ) : (
                                      <button
                                        onClick={addPickup}
                                        className="btn btn-success"
                                      >
                                        ยืนยันการเบิก
                                      </button>
                                    )
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="row">
                          <div className="col-9">
                            <div className="product-grid">
                              {searchKeyword ? (
                                <div
                                  className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"
                                  id="products-container"
                                >
                                  {searchKeyword
                                    ? searchResults.map((product) => (
                                        <div key={product.id} className="col">
                                          <div className="card product-card">
                                            <div className="card-header bg-transparent border-bottom-0">
                                              <div className="d-flex align-items-center justify-content-end"></div>
                                            </div>
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <img
                                                src={product.img_url}
                                                style={{
                                                  width: 100,
                                                  height: 100,
                                                }}
                                                className="card-img-top"
                                                alt="..."
                                              />
                                            </div>
                                            <div className="card-body">
                                              <div className="product-info">
                                                <h6 className="product-name mb-2">
                                                  {product.name}
                                                </h6>
                                                <div style={{display:'flex',justifyContent:'space-between'}}>
                                                  <div className="product-price">
                                                    <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "blue",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      ฿ {product.price}
                                                    </span>
                                                  </div>
                                                  <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "skyblue",
                                                        
                                                      }}
                                                    >
                                                      ({product.categorys})
                                                    </span>
                                                </div>
                                                <div style={{display:'flex',justifyContent:'space-between'}}>
                                                <span
                                                  style={{ fontWeight: "bold" }}
                                                >
                                                  {product.code}
                                                </span>
                                                <span
                                                  style={{ fontWeight: "bold",color:"salmon" }}
                                                >
                                                  ชั้น {product.shelf}
                                                </span>
                                                </div>
                                                
                                                <div className=" mt-2">
                                                  <div className="row">
                                                    <div className="col-6">
                                                      <input
                                                        className=" form-control "
                                                        min="1"
                                                        id={`quantity_${product.id}`}
                                                        type="number"
                                                        defaultValue="1"
                                                      />
                                                    </div>
                                                    <div className="col-6">
                                                      <button
                                                        className="btn btn-primary "
                                                        onClick={() =>
                                                          addToCart(
                                                            product.id,
                                                            parseInt(
                                                              document.getElementById(
                                                                `quantity_${product.id}`
                                                              ).value
                                                            )
                                                          )
                                                        }
                                                        disabled={loading}
                                                      >
                                                        <i className="fas fa-plus"></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              ) : (
                                <div
                                  className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"
                                  id="products-container"
                                >
                                  {product
                                    ? product.map((product) => (
                                        <div key={product.id} className="col">
                                          <div className="card product-card">
                                            <div className="card-header bg-transparent border-bottom-0">
                                              <div className="d-flex align-items-center justify-content-end"></div>
                                            </div>
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <img
                                                src={product.img_url}
                                                style={{
                                                  width: 100,
                                                  height: 100,
                                                }}
                                                className="card-img-top"
                                                alt="..."
                                              />
                                            </div>
                                            <div className="card-body">
                                              <div className="product-info">
                                                <h6 className="product-name mb-2" style={{fontWeight: "bold",}}>
                                                  {product.name}
                                                </h6>
                                                <div style={{display:'flex',justifyContent:'space-between'}}>
                                                  <div className="product-price">
                                                    <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "blue",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      ฿ {product.price}
                                                    </span>
                                                  </div>
                                                  <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "skyblue",
                                                        
                                                      }}
                                                    >
                                                      ({product.categorys})
                                                    </span>
                                                </div>
                                                <div style={{display:'flex',justifyContent:'space-between'}}>
                                                <span
                                                  style={{ fontWeight: "bold" }}
                                                >
                                                  {product.code}
                                                </span>
                                                <span
                                                  style={{ fontWeight: "bold",color:"salmon" }}
                                                >
                                                  ชั้น {product.shelf}
                                                </span>
                                                </div>
                                                <div className=" mt-2">
                                                  <div className="row">
                                                    <div className="col-6">
                                                      <input
                                                        className=" form-control "
                                                        min="1"
                                                        id={`quantity_${product.id}`}
                                                        type="number"
                                                        defaultValue="1"
                                                      />
                                                    </div>
                                                    <div className="col-6">
                                                      <button
                                                        className="btn btn-primary "
                                                        onClick={() =>
                                                          addToCart(
                                                            product.id,
                                                            parseInt(
                                                              document.getElementById(
                                                                `quantity_${product.id}`
                                                              ).value
                                                            )
                                                          )
                                                        }
                                                        disabled={loading}
                                                      >
                                                        <i className="fas fa-plus"></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-3">
                            <h5>รายการ</h5>
                            <hr />
                            <div id="cart-response">
                              <table className=" table table-striped">
                                <tbody>
                                  {cart
                                    ? cart.map((c) => (
                                        <tr key={c.id}>
                                          <td
                                            style={{ width: "70%" }}
                                            className=" align-middle"
                                          >
                                            <h6>{c.name}</h6>
                                          </td>
                                          <td className=" align-middle titles text-nowrap">
                                            <div style={{ padding: 5 }}>
                                              <span
                                                onClick={() =>
                                                  UpdateCart(c.idp, "minus")
                                                }
                                                style={{
                                                  backgroundColor: "#ddd",
                                                  padding: 5,
                                                  paddingLeft: 10,
                                                  paddingRight: 10,
                                                  borderRadius: "100%",
                                                  cursor: "pointer",
                                                  pointerEvents: loading1
                                                    ? "none"
                                                    : "auto", // ตั้งค่า pointerEvents เพื่อ disable ปุ่มเมื่อ quantity เป็น 1
                                                  opacity: loading1 ? 0.5 : 1,
                                                }}
                                              >
                                                <i className="fas fa-minus "></i>
                                              </span>
                                              <span style={{ fontSize: 18 }}>
                                                &nbsp;&nbsp;{c.item}&nbsp;&nbsp;
                                              </span>
                                              <span
                                                onClick={() =>
                                                  UpdateCart(c.idp, "plus")
                                                }
                                                style={{
                                                  backgroundColor: "#ddd",
                                                  padding: 5,
                                                  paddingLeft: 10,
                                                  paddingRight: 10,
                                                  borderRadius: "50%",
                                                  cursor: "pointer",
                                                  pointerEvents: loading1
                                                    ? "none"
                                                    : "auto", // ตั้งค่า pointerEvents เพื่อ disable ปุ่มเมื่อ quantity เป็น 1
                                                  opacity: loading1 ? 0.5 : 1,
                                                }}
                                              >
                                                <i className="fas fa-plus "></i>
                                              </span>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                    : null}
                                </tbody>
                              </table>
                              <h6>
                                <span style={{ fontWeight: "bold" }}>
                                  พนักงานเบิก:
                                </span>{" "}
                                {staff?.name} {staff?.last}{" "}
                                {staff?.nickname
                                  ? +"(" + staff.nickname + ")"
                                  : null}
                              </h6>

                              <div className="row">
                                <div className="col-12 "></div>
                                <div
                                  className="col-12 mt-3"
                                  style={{
                                    paddingTop: 5,
                                    textAlign: "center",
                                  }}
                                >
                                  {cart ? (
                                    loadings ? (
                                      <button
                                        type="submit"
                                        name="btn_login"
                                        className="btn btn-primary titles"
                                        disabled
                                      >
                                        <i className="fas fa-spinner fa-spin"></i>{" "}
                                        กำลังบันทึก
                                      </button>
                                    ) : (
                                      <button
                                        onClick={addPickup}
                                        className="btn btn-success"
                                      >
                                        ยืนยันการเบิก
                                      </button>
                                    )
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <a href="javaScript:;" className="back-to-top">
        <ion-icon name="arrow-up-outline"></ion-icon>
      </a>
      <div className="overlay"></div>
    </div>
  ) : (
    <Login />
  );
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Pickup/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
