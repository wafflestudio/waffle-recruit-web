import React from 'react';

import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

import storage, { StorageKey } from '../lib/storage';

import './Sidebar.css';

const Sidebar: React.FC = () => {
  const history = useHistory();

  const onClickSignOut = () => {
    axios
      .get('/check/signout/')
      .then(() => {
        storage.remove(StorageKey.LoggedInUser);
        history.replace('/signin');
      })
      .catch(() => {
        alert('로그아웃 실패.');
      });
  };
  return (
    <div className="additional">
      <div className="sidebar">
        <Link to={'/problem/1/'}>Problem 1</Link>
        <br />
        <Link to={'/problem/2/'}>Problem 2</Link>
        <br />
        <Link to={'/problem/3/'}>Problem 3</Link>
        <br />
        <Link to={'/'} onClick={onClickSignOut}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
