import React, { useEffect, useState } from 'react';

import { DateTime } from 'luxon';
import { useCookies } from 'react-cookie';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import modalNotice, { msg0805 } from './modalNotice';

const ModalWrapper = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;
const ModalHeader = styled.div`
  height: 2em;
  text-align: center;
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 30px;
  box-sizing: border-box;
`;
const Modal = styled.div`
  width: 940px;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  padding: 80px 40px 80px 40px;
  background-color: white;
  box-sizing: border-box;
  overflow: auto;
  pre {
    overflow: visible;
  }
`;
const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    display: flex;
    align-items: center;
    border: 0;
    border-radius: 10px;
    padding: 10px 15px 10px 15px;
    margin-left: 15px;
    color: white;
    font-weight: bold;

    &.otherNotice {
      background-color: #de8234;

      &:hover {
        background-color: #af6220;
      }
    }

    &.closeModal {
      background-color: #0a942c;

      &:hover {
        background-color: #0ea432;
      }
    }

    &.no-more {
      background-color: #dc2724;

      &:hover {
        background-color: #e81c18;
      }
    }
  }
`;

const MainModal = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies();
  const [noticeNumber, setNoticeNumber] = useState<number>(modalNotice.length - 1);
  //  const [{ title, content }, setNotice] = useState<{ title: string; content: string }>(modalNotice[modalNotice.length - 1]);

  useEffect(() => {
    const { isPopupDisabled } = cookies;
    if (isPopupDisabled) setOpenModal(false);
    else setOpenModal(true);
  }, []);

  if (!isOpenModal) {
    return null;
  }

  return (
    <ModalWrapper
      onClick={() => {
        setOpenModal(false);
      }}
    >
      <Modal
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ModalHeader> {modalNotice[noticeNumber].title}</ModalHeader>
        <ReactMarkdown source={modalNotice[noticeNumber].content} />
        <ModalButtons>
          {noticeNumber !== 0 && (
            <button
              className="otherNotice"
              onClick={() => {
                setNoticeNumber(noticeNumber - 1);
              }}
            >
              이전
            </button>
          )}
          {noticeNumber !== modalNotice.length - 1 && (
            <button
              className="otherNotice"
              onClick={() => {
                setNoticeNumber(noticeNumber + 1);
              }}
            >
              다음
            </button>
          )}
          <button
            className="closeModal"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            닫기
          </button>
          <button
            className="no-more"
            onClick={() => {
              setCookie('isPopupDisabled', true, { expires: DateTime.local().plus({ hour: 24 }).toJSDate(), path: '/' });
              setOpenModal(false);
            }}
          >
            오늘 안에 보지 않기
          </button>
        </ModalButtons>
      </Modal>
    </ModalWrapper>
  );
};

export default MainModal;
