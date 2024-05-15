import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import TickIcon from "./TickIcon";
import Modal from "./Modal";

const ListItem = ({task, getData}) => {
  const [showModal, setShowModal] = useState(false)
  const deleteItem = async() => {
    try {
      const response =  await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
         method: "DELETE",
       })
       if (response.status === 200) {
         console.log("worked");
         setShowModal(false);
         getData()
       }
     } catch(err) {
       console.log(err)
     }
  }
  return (
    <li className="list-item">


      <div className="info-container">
        <TickIcon />
        <p className="task-title">{task.title}</p>
        <ProgressBar progress={task.progress}/>
      </div> 

      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>Edit</button>
        <button className="delete" onClick={deleteItem}>Delete</button>
      </div>
      {showModal && <Modal getData={getData} mode={"edit"} setShowModal={setShowModal} task={task}/>}
    </li>
  );
};

export default ListItem;
