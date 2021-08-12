import React, { useEffect, useState } from 'react';

import { DateTime } from 'luxon';
import { useCookies } from 'react-cookie';
import ReactGA from 'react-ga';
import ReactMarkdown from 'react-markdown';
import { Switch, useHistory, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button, Header, Loader, Modal } from 'semantic-ui-react';

import { requester } from './apis/requester';
import Footer from './component/Footer';
import { useAuthContext } from './context/authContext';
import AuthorizedRouter from './pages/AuthorizedRouter';
import UnauthorizedRouter from './pages/UnauthorizedRouter';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

ReactGA.initialize('UA-204463168-1');

const App: React.FC = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isTokenChecked, setTokenChecked] = useState<boolean>(false);
  const { setUser, clearUser, setCsrf } = useAuthContext();
  const history = useHistory();
  const [cookies, setCookie] = useCookies();
  const { pathname, search } = useLocation();

  const isAuthNeeded = pathname.includes('problem') || pathname.includes('main');

  useEffect(() => {
    const { isPopupDisabled } = cookies;
    if (isPopupDisabled) setOpenModal(false);
    else setOpenModal(true);
  }, []);

  useEffect(() => {
    ReactGA.pageview(search + pathname);
  }, [search, pathname]);

  useEffect(() => {
    requester.get<{ user?: string; token: string }>('/check/token/').then((res) => {
      setTokenChecked(true);
      setCsrf(res.data.token);
      requester.defaults.headers['X-CSRFToken'] = res.data.token;
      if (!res.data.user && isAuthNeeded) {
        clearUser();
        history.replace('/signin');
      } else if (res.data.user) {
        setUser(res.data.user);
        if (!isAuthNeeded) {
          history.replace('main');
        }
      }
    });
  }, [pathname]);

  if (!isTokenChecked) return <Loader active />;

  return (
    <>
      <div className="App">
        <Switch>{isAuthNeeded ? <AuthorizedRouter /> : <UnauthorizedRouter />}</Switch>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal style={{ position: 'fixed', left: 100, right: 100 }} open={isOpenModal} onClose={() => setOpenModal(false)}>
        <Header icon="archive" content="루키 모집 D-3 (08/12 22:41 업데이트)" />
        <Modal.Content scrolling>
          <ReactMarkdown
            source={`\`\`\`

와플스튜디오 18.5기 rookies 모집 마감이 3일 남았습니다!

지원자분들께서는 다음 사항을 꼭 확인해주시기 바랍니다.


- 지원 마감은 8월 15일 오후 11시 59분이며, 이 시간 이후로 문제나 자기소개서 제출은 불가능합니다.

- 8월 16일 오전 12시 00분부터 12시 30분까지, 지원해주신 루키분들에 대해 지원이 확인되었다는 메일이 발송됩니다.
  - 혹 해당 시간 동안 메일을 받지 못하신 경우, recruit@wafflestudio.com 으로 문의 부탁드립니다.
  
- 모집 결과는 최대한 빠르게 공지드리겠습니다.
  - 모든 지원자분들의 자기소개서를 하나하나 읽어봐야 하기 때문에, 시간이 조금 걸릴 수 있는 점 양해 부탁드립니다.
 
- 문제를 다 풀지 못하셨어도 지원하실 수 있습니다. 와플스튜디오는 참여하고자 하는 열정이 있는 루키 여러분을 환영합니다.


그럼 마지막까지 모두들 건투를 빌어요!

\`\`\``}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            onClick={() => {
              setCookie('isPopupDisabled', true, { expires: DateTime.local().plus({ hour: 24 }).toJSDate(), path: '/' });
              setOpenModal(false);
            }}
          >
            24시간 동안 보지 않기
          </Button>
          <Button color="green" onClick={() => setOpenModal(false)}>
            닫기
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default App;
