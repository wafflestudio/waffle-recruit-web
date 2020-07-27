import React from "react";
import storage from "../lib/storage";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./Header.css";

function Sidebar() {
  let history = useHistory();

  const onClickSignOut = () => {
    axios
      .get("/check/signout/")
      .then((res) => {
        storage.remove("logged_in_user");
        history.push("/signin");
      })
      .catch((err) => {
        alert("로그아웃 실패.");
      });
  };
  return (
    <div className="additional">
      <div className="sidebar">
        <Link to={"/main/1/"}>Problem 1</Link>
        <br />
        <Link to={"/main/2/"}>Problem 2</Link>
        <br />
        <Link to={"/"} onClick={onClickSignOut}>
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
