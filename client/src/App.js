import React from "react";
import { Link } from "react-router-dom";
import data from "./data";
function App() {
  return (
    <div className="grid-container">
      <header className="row">
        <div>
          <Link to="/" className="brand">
            Ecommerce-App
          </Link>
        </div>
        <div>
          <Link to="/cart">Cart</Link>
          <Link to="/sigin">Signin</Link>
        </div>
      </header>
      <main>
        <div className="row center">
          {data.products.map((product) => (
            <div key={product._id} className="card">
              <Link to={`/product/${product._id}`}>
                <img
                  className="medium"
                  src={product.image}
                  alt={product.name}
                />
              </Link>
              <div className="card-body">
                <Link to="product.html">
                  <h2>{product.name}</h2>
                </Link>
                <div className="rating">
                  <span>
                    <i className="fa fa-star"></i>
                  </span>
                  <span>
                    <i className="fa fa-star"></i>
                  </span>
                  <span>
                    <i className="fa fa-star"></i>
                  </span>
                  <span>
                    <i className="fa fa-star"></i>
                  </span>
                  <span>
                    <i className="fa fa-star"></i>
                  </span>
                </div>
                <div className="price">${product.price}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="row center">All Rights Reserved</footer>
    </div>
  );
}

export default App;
