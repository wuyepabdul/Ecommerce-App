import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyOrder } from "../actions/orderActions";
import LoadingBox from "../components/screen/LoadingBox";
import MessageBox from "../components/screen/MessageBox";

function OrderHistoryScreen(props) {
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listMyOrder());
  }, [dispatch]);
  return (
    <div>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL - $</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.isDeliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <button
                    className="small"
                    type="button"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistoryScreen;
