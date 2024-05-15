import React, { useState } from "react";
import { useCookies } from "react-cookie";

const Modal = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editMode = props.mode === "edit" ? true : false;

  const [data, setData] = useState({
    user_email: editMode ? props.task.user_email : cookies,
    title: editMode ? props.task.title : "",
    progress: editMode ? parseInt(props.task.progress) : 50,
    date: editMode ? props.date : new Date(),
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response.status === 200) {
        console.log("worked");
        props.setShowModal(false);
        props.getData()
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editData = async(e) => {
    e.preventDefault()
    try {
     const response =  await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${props.task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      console.log(response)
      if (response.status === 200) {
        console.log("worked");
        props.setShowModal(false);
        props.getData()
      }
    } catch(err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    console.log("changing");
    const { name, value } = e.target;
    setData((d) => ({
      ...d,
      [name]: value,
    }));
    console.log(data);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {props.mode} your task</h3>
          <button onClick={() => props.setShowModal(false)}>X</button>
        </div>
        <form>
          <input
            type="text"
            required
            maxLength={30}
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label for="id">Drag to select your current progress</label>
          <input
            id="range"
            type="range"
            min={0}
            max={100}
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input
            type="submit"
            onClick={editMode ? editData : postData}
            className={props.mode}
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;
