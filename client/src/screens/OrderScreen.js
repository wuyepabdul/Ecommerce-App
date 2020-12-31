import React, { useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoadingBox from "../components/screen/LoadingBox";
import MessageBox from "../components/screen/MessageBox";
import { getDetailsOrder, payOrder } from "../actions/orderActions";
import Axios from "axios";
import { ORDER_PAYMENT_RESET } from "../constants/orderConstants";

function OrderScreen(props) {
  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  /* order details state from redux */
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  /* order payment state from redux */
  const orderPayment = useSelector((state) => state.orderPayment);
  const {
    error: paymentError,
    success: paymentSuccess,
    loading: paymentLoading,
  } = orderPayment;

  const dispatch = useDispatch();

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script); // adds scripts as the last child in the body of our html
    };
    if (!order || paymentSuccess || (order && order._id !== orderId)) {
      //order && order._id !== orderId means order exist but order.id does not equal to orderID(url id)
      //this means if order is not loaded, load the order by dispatching getDetailsOrder action or if payment is successful dispatch getDetailsOrder
      dispatch({ type: ORDER_PAYMENT_RESET }); //prevents infinite ORDER_DETAILS_REQUEST and ORDER_DETAILS_SUCCESS loop in redux
      dispatch(getDetailsOrder(orderId));
    } else {
      //we have order at this point
      if (!order.isPaid) {
        // check if order.isPaid is false
        if (!window.paypal) {
          //check if paypal was loaded, if it wasn't loaded we then call addPaypalScript
          addPayPalScript();
        } else {
          //this means we have an unpaid order and paypal is already loaded
          setSdkReady(true);
        }
      }
    }
  }, [orderId, order, sdkReady, dispatch, paymentSuccess]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Order {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                {console.log("orderDetails=>", orderDetails)}
                <p>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address:</strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          />
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax </div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>

              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {paymentError && (
                        <MessageBox variant="danger">{paymentError}</MessageBox>
                      )}
                      {paymentLoading && <LoadingBox></LoadingBox>}
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;
