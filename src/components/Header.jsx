import { useRef, use } from "react";
import "./../index.css";
import logo from "./../../public/logo.jpg";
import Modal from "./Modal";
import { MealsContext } from "./meals-context";

export default function Header() {
  const modal = useRef();
  const { items } = use(MealsContext);
  const cartQuantity = items.length;

  function handleOpenCartClick() {
    modal.current.open();
  }

  return (
    <>
      <Modal 
        ref={modal}
      />
      <div id="main-header">
        <div id="title">
          <img src={logo} alt="Not found" />
          <h1>Reactfood</h1>
        </div>
        <button className="button" onClick={handleOpenCartClick}>Cart ({cartQuantity})</button>
      </div>
    </>
  );
}
