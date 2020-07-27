import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import "./Footer.css";

function Footer() {
  return (
    <div className="center, footbox">
      <a href="https://github.com/wafflestudio/waffle_recruit" target="_blank">
        <Image src="/logo.png" size="small" className="center" />
      </a>
      {/* <p className="center">문의: zlzlqlzl1@wafflestudio.com</p> */}
    </div>
  );
}

export default Footer;
