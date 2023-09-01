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
          title: "sending...",
          message: "Sending cart data",
        })
      );
      const response = fetch(
        "https://react-redux-cart-1e16c-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
      if (!response.ok) {
        throw new Error("Sending cart data failed")
      }
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "success...",
          message: "Sending cart data successfully",
        })
      );
     
      const responseData = await response.json();
    };
    if(isInitial){
      isInitial= false;
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
        <Notification status={notification.status} title={notification.title} />
      )}
      {showCart && <Cart />}

      <Products />
    </Layout>
  );
}

export default App;
