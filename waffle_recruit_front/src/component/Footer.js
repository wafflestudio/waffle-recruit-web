import React, {Component} from 'react';
import storage from "../lib/storage";
import './Footer.css'

export default class Sidebar extends Component {
  logout = () => {
    storage.remove('logged_in_user');
  }

  render() {
    return (
      <div className="additional">
        <div className="footer">
          <div>
            문의: zlzlqlzl1@wafflestudio.com
          </div>
        </div>
      </div>
    )
  }
}