import React, { useEffect, useState } from 'react';

import { Route, Redirect, Switch, useHistory, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Loader } from 'semantic-ui-react';

import { requester } from './apis/requester';
import Footer from './component/Footer';
import { useAuthContext } from './context/authContext';
import Main from './pages/problem/[probNum]';
import Submit from './pages/problem/[probNum]/submit';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [isTokenChecked, setTokenChecked] = useState<boolean>(false);
  const { setUser, clearUser } = useAuthContext();
  const history = useHistory();

  const { pathname } = useLocation();

  const isAuthNeeded = pathname.includes('problem');

  useEffect(() => {
    requester.get<{ user: string }>('/check/token/').then((res) => {
      setTokenChecked(true);
      if (res.status === 204 && isAuthNeeded) {
        clearUser();
        history.replace('/signin');
      } else if (res.status === 200) {
        setUser(res.data.user);
        if (!isAuthNeeded) {
          history.replace('/problem/0');
        }
      }
    });
  }, [pathname]);

  if (!isTokenChecked) return <Loader />;

  return (
    <>
      <div className="App">
        <Switch>
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/problem/:prob_num" exact component={Main} />
          <Route path="/problem/:prob_num/submit" exact component={Submit} />
          <Redirect from="/" to="/signin" />
        </Switch>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
