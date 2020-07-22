import React, {Component} from 'react';
import {Button, Image} from "semantic-ui-react";
import storage from "../lib/storage";
import {Link} from "react-router-dom";
import './Header.css'

export default class Sidebar extends Component {
  logout = () => {
    storage.remove('logged_in_user');
  }

  render() {
    return (
      <div className="additional">
        <div className="head">
          <Image src='/logo.png' size='small'/>
        </div>

        <div className="sidebar">
          <Link to={'/main/1/'}>Problem 1</Link>
          <br/>
          <Link to={'/main/2/'}>Problem 2</Link>
        </div>
      </div>
    )
  }
}