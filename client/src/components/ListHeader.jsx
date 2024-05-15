import React, { useState } from "react";
import Modal from "./Modal";
import { useCookies } from "react-cookie";

const ListHeader = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [showModal, setShowModal] = useState(false)
  const signOut = () => {
    console.log("Signout");
    removeCookie("Email")
    removeCookie("AuthToken")
    window.location.reload()
  };

  return (
    <div className="list-header">
      <h1>{props.listName}</h1>
      <div className="button-container">
        <button className="create" onClick={() => setShowModal(true)}>Add new</button>
        <button className="signout" onClick={signOut}>
          Sign out
        </button>
      </div>
      {showModal && <Modal mode={"create"} getData={props.getData} setShowModal={setShowModal} />}
    </div>
  );
};

export default ListHeader;
