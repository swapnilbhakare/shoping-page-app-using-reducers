import { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "./Store/uiSlice";
import Notification from "./components/UI/Notification";
let isInitial = true;

function App() {
  const dispatch = useDispatch();

  const showCart = useSelector((state) => state.ui.cartIsVisible);

  const cart = useSelector((state) => state.cart);

  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",

          title: "Sending...",

          message: "Sending cart data",
        })
      );

      try {
        const response = await fetch(
          "https://react-redux-cart-1e16c-default-rtdb.firebaseio.com/cart.json",

          {
            method: "PUT",

            body: JSON.stringify(cart),
          }
        );

        if (!response.ok) {
          throw new Error("Sending cart data failed");
        }

        dispatch(
          uiActions.showNotification({
            status: "success",

            title: "Success!",

            message: "Sending cart data successfully",
          })
        );

        // ... Handle success cases here ...
      } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: "error",

            title: "Error!",

            message: "Sending cart data failed",
          })
        );
      }
    };

    if (isInitial) {
      isInitial = false;

      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",

          title: "Error...",

          message: "Sending cart data failed",
        })
      );
    });
  }, [cart, dispatch]);
  return (
    <Layout>
      {notification && (
        <Notification status={notification.status} title={notification.title} message={notification.message} />
      )}
      {showCart && <Cart />}

      <Products />
    </Layout>
  );
}

export default App;
