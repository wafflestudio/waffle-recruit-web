import React, { useEffect, useState } from 'react';

import './MainModal.css';
import { DateTime } from 'luxon';
import { useCookies } from 'react-cookie';
import ReactMarkdown from 'react-markdown';
import { Button, Header, Modal } from 'semantic-ui-react';

const MainModal = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    const { isPopupDisabled } = cookies;
    if (!isPopupDisabled) setOpenModal(false);
    else setOpenModal(true);
  }, []);

  return (
    <Modal className="MainModal" open={isOpenModal} onClose={() => setOpenModal(false)}>
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
  );
};

export default MainModal;
