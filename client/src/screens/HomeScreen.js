import React, { useEffect } from "react";
import Product from "../components/screen/Product";
import LoadingBox from "../components/screen/LoadingBox";
import MessageBox from "../components/screen/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";

function HomeScreen() {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  return (
    <div className="row center">
      {loading && <LoadingBox></LoadingBox>}
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      {products &&
        products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
    </div>
  );
}

export default HomeScreen;
