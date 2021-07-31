import React from 'react';

import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { requester } from '../apis/requester';
import { useAuthContext } from '../context/authContext';

import './Sidebar.css';

const Sidebar: React.FC = () => {
  const history = useHistory();
  const { user, clearUser } = useAuthContext();

  const onClickSignOut = async () => {
    try {
      await requester.get('/check/signout/');
      clearUser();
      history.replace('/signin');
    } catch (err) {
      toast.error('로그아웃 실패.');
    }
  };

  return (
    <div className="additional">
      <div className="sidebar">
        <Link to={'/problem/0/'}>test problem</Link>
        <br />
        <Link to={'/problem/1/'}>Problem 1</Link>
        <br />
        <Link to={'/problem/2/'}>Problem 2</Link>
        <br />
        <Link to={'/problem/3/'}>Problem 3</Link>
        <br />
        <br />
        <br />
        <br />
        <br />

        <p style={{ width: 150, wordBreak: 'break-all' }}>Signed as {user}</p>

        <Link to={'/'} onClick={onClickSignOut}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
