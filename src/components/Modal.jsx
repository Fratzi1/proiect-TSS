import "./../index.css";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Cart from "./Cart";
import Checkout from "./Checkout";

const Modal = forwardRef(function Modal({ type }, ref) {
  const dialog = useRef();
  const [modalType, setModalType] = useState('Cart');

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setModalType('Cart');
        dialog.current.showModal();
      },
      switchTo: (newType) => {
        setModalType(newType);
      },
    };
  });

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {modalType === "Cart" && (
        <Cart onCheckout={() => setModalType("Checkout")} />
      )}
      {modalType === "Checkout" && (
        <Checkout
          onBack={() => setModalType("Cart")}
          onAfterOrder={() => setModalType("Ordered")}
        />
      )}
      {modalType === "Ordered" && (
        <>
          <p>Your order has been registered and will be delivered soon.</p>
          <form method="dialog" className="modal-actions">
            <button className="button">Return to the shop</button>
          </form>
        </>
      )}
    </dialog>,
    document.getElementById("modal")
  );
});

export default Modal;
