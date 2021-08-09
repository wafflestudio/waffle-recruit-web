import React, { useEffect, useState } from 'react';

import { DateTime } from 'luxon';
import { useCookies } from 'react-cookie';
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

const App: React.FC = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isTokenChecked, setTokenChecked] = useState<boolean>(false);
  const { setUser, clearUser, setCsrf } = useAuthContext();
  const history = useHistory();
  const [cookies, setCookie] = useCookies();
  const { pathname } = useLocation();

  const isAuthNeeded = pathname.includes('problem') || pathname.includes('main');

  useEffect(() => {
    const { isPopupDisabled } = cookies;
    if (isPopupDisabled) setOpenModal(false);
    else setOpenModal(true);
  }, []);

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
        <Header icon="archive" content="루키 세미나 날짜 공지" />
        <Modal.Content scrolling>
          <ReactMarkdown
            source={`\`\`\`
안녕하세요, 와플스튜디오 운영팀입니다. rookies 세미나 날짜 및 시간이 결정되어 공지드립니다.

- OT    :  8월 22일(일) 오후 2시
- 세미나 0:  8월 28일(토) ~  8월 29일(일)
- 세미나 1:  9월  4일(토) ~  9월  5일(일)
- 세미나 2:  9월 11일(토) ~  9월 12일(일)
- 세미나 3:  9월 25일(토) ~  9월 26일(일)
- 세미나 4: 10월  9일(토) ~ 10월 10일(일)
- 세미나 5: 11월  6일(토) ~ 11월  7일(일)

세미나별 시간은 다음과 같습니다. 각 세미나는 1시간 ~ 1시간 30분 가량 소요됩니다.

- 백엔드 (장고): 토요일 오전 10시
- 안드로이드: 토요일 오전 11시 30분
- 백엔드 (스프링): 토요일 오후 3시
- 프론트: 토요일 오후 4시 30분
- iOS: 일요일 오후 1시

8월 22일 OT는 루키 세미나 진행을 위해 필히 참석해 주셔야 합니다.
어떤 세미나를 들으실지는 선택하실 수 있으며, 그 부분은 OT에서 공지드릴 예정입니다.

모든 세션은 코로나가 현 상황을 유지한다면 온라인으로 진행되지만, 경과에 따라 오프라인으로 전환될 수 있습니다.
세미나 0은 각 세미나마다 있을 수도, 없을 수도 있습니다. 추후 공지될 예정입니다.

*세미나별 상세 시간은 낮은 확률로 변동될 수 있습니다.*

와플스튜디오 운영팀 드림
\`\`\``}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            onClick={() => {
              setCookie('isPopupDisabled', true, { expires: DateTime.local().plus({ hour: 24 }).toJSDate() });
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
