import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import "./containers.css";
import "./Main.css";
import { Form, Container, TextArea, Button, Message } from "semantic-ui-react";
import Header from "../component/Header";
import ReactMarkdown from "react-markdown";
import Footer from "../component/Footer";
import { useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import emoji from "emoji-dictionary";
import storage from "../lib/storage";

function Main({ match }) {
  const [problem, setProblem] = useState("");
  const [problemInput, setProblemInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [solvers, setSolvers] = useState(0);
  let history = useHistory();

  const problems = [
    "# 이미지 해독하기 :white_check_mark:\n" +
      "- 이번 문제는 입력 이미지를 해독해서 암호 코드를 찾아내는 문제입니다.\n" +
      "- 당신에게는 입력으로 `L` * `H` * `W` 길이의 0,1,2 로만 이루어진 숫자들이 주어집니다.\n" +
      "- 입력은 각각의 레이어가 높이 `H`, 너비 `W`인 `L`개의 레이어를 나타냅니다.\n" +
      "- 암호를 해독하는 방법은 다음과 같습니다.\n" +
      "    - 각 레이어에 존재하는 0,1,2 는 순서대로 **흰색 칸, 검은색 칸, 투명한 칸**을 나타냅니다.\n" +
      "    - 레이어를 처음나온 레이어부터 맨 위, 마지막 레이어가 맨 밑에 오도록 순서대로 쌓습니다.\n" +
      "    - 쌓아올린 레이어를 위에서 올려다 보면 흰색과 검은색으로 나타난 암호 코드를 획득할 수 있습니다.\n" +
      "\n" +
      "## 예시\n" +
      "- `L`, `H`, `W` = 4, 2, 2\n" +
      "- input: 0222112222120000\n" +
      "\n" +
      "```\n" +
      "Layer 1: 02\n" +
      "         22\n" +
      "\n" +
      "Layer 2: 11\n" +
      "         22\n" +
      "\n" +
      "Layer 3: 22\n" +
      "         12\n" +
      "\n" +
      "Layer 4: 00\n" +
      "         00\n" +
      "```\n" +
      "- 해독한 암호의 왼쪽 위 픽셀은 위에서 첫번째 레이어가 0(흰색) 이므로 0(흰색)이 됩니다.\n" +
      "- 해독한 암호의 오른쪽 위 픽셀은 위에서 첫번째 레이어가 2(투명)이고, 두번째 레이어가 1(검은색) 이므로 1(검은색)이 됩니다.\n" +
      "- 해독한 암호의 왼쪽 아래 픽셀은 위에서 첫번째, 두번째 레이어가 2(투명)이고, 세번째 레이어가 1(검은색) 이므로 1(검은색)이 됩니다.\n" +
      "- 해독한 암호의 오른쪽 아래 픽셀은 위에서 첫번째, 두번째, 세번째 레이어가 2(투명)이고, 네번째 레이어가 0(흰색) 이므로 0(흰색)이 됩니다.\n" +
      "```\n" +
      "decoded: 01\n" +
      "         10\n" +
      "```\n" +
      "\n" +
      "## 입력 형식\n" +
      "- 당신에게 주어지는 입력의 크기는 `L`, `H`, `W` = 5, 7, 30 입니다.\n" +
      "- 해독을 통해 얻은 암호를 읽어 5자리 알파벳으로 제출해주세요.\n" +
      "----",
    "# 항성계의 공전주기 :white_check_mark:\n" +
      "- 이번 문제는 여러 행성들로 이루어진 항성계의 모습이 주어졌을 때, 해당 항성계의 주기를 측정해야합니다.\n" +
      "- 항성계는 4개의 행성으로 이루어져 있으며 각 행성의 x, y, z 좌표가 주어집니다. 행성들의 **초기 속도는 모두 0**입니다.\n" +
      "- 행성들은 매 스텝마다 주어진 규칙에 따라 움직입니다.\n" +
      "- 항성계의 주기는 행성들이 **처음과 동일한 좌표, 속도** 가 될 때 까지 움직인 스텝의 수입니다.\n" +
      "- 행성들이 1스텝 동안 움직이는 규칙은 아래와 같습니다.\n" +
      "    1. 행성들의 가속도를 체크합니다.\n" +
      "        - 행성 A의 x 축 가속도 = (항성계에서 행성 A보다 x 좌표가 큰 행성의 갯수) - (...행성 A보다 x 좌표가 작은 행성의 갯수)\n" +
      "        - 행성 A의 y 축 가속도 = (항성계에서 행성 A보다 y 좌표가 큰 행성의 갯수) - (...행성 A보다 y 좌표가 작은 행성의 갯수)\n" +
      "        - ...\n" +
      "        - 위 규칙으로 모든 행성들의 x, y, z 가속도를 체크합니다.\n" +
      "    2. 가속도로 행성들의 속도를 업데이트합니다.\n" +
      "        - 각 행성의 각 축 방향 속도 += 각 행성의 각 축 방향 가속도\n" +
      "    3. 속도로 행성들의 좌표를 업데이트합니다.\n" +
      "        - 각 행성의 각 축 방향 좌표 += 각 행성의 각 축 방향 속도\n" +
      "\n" +
      "## 예시\n" +
      "- 초기 상태가 다음과 같은 항성계가 있습니다.\n" +
      "```\n" +
      "<x= -1, y=  0, z=  2>\n" +
      "<x=  2, y=-10, z= -7>\n" +
      "<x=  4, y= -8, z=  8>\n" +
      "<x=  3, y=  5, z= -1>\n" +
      "```\n" +
      "- 위 항성계가 첫번째 스텝에서 얻는 가속도는 아래와 같습니다.\n" +
      "    - 위에서 부터 순서대로 행성 이름을 A,B,C,D 로 붙입니다.\n" +
      "    - A의 x 축 방향 가속도는 `-1 < 2,  -1 < 4, -1 < 3`으로 세 행성이 자기보다 x 축 방향 좌표가 크기 때문에 3 - 0 = 3 입니다.\n" +
      "    - A의 y 축 방향 가속도는 `0 > -10, 0 > -8, 0 < 5`으로 한 행성이 자기보다 y 축 방향 좌표가 크고, 두 행성이 자기보다 y 축 방향 좌표가 작기 때문에 1 - 2 = -1 입니다.\n" +
      "    - 위 방법을 A의 z 축과 다른 모든 행성에 적용해 가속도를 구합니다.\n" +
      "- 위 항성계가 매 스텝마다 움직인 방식은 아래와 같습니다.\n" +
      "```\n" +
      "After 0 steps:\n" +
      "pos=<x=-1, y=  0, z= 2>, vel=<x= 0, y= 0, z= 0>\n" +
      "pos=<x= 2, y=-10, z=-7>, vel=<x= 0, y= 0, z= 0>\n" +
      "pos=<x= 4, y= -8, z= 8>, vel=<x= 0, y= 0, z= 0>\n" +
      "pos=<x= 3, y=  5, z=-1>, vel=<x= 0, y= 0, z= 0>\n" +
      "\n" +
      "After 1 step:\n" +
      "pos=<x= 2, y=-1, z= 1>, vel=<x= 3, y=-1, z=-1>\n" +
      "pos=<x= 3, y=-7, z=-4>, vel=<x= 1, y= 3, z= 3>\n" +
      "pos=<x= 1, y=-7, z= 5>, vel=<x=-3, y= 1, z=-3>\n" +
      "pos=<x= 2, y= 2, z= 0>, vel=<x=-1, y=-3, z= 1>\n" +
      "\n" +
      "After 2 steps:\n" +
      "pos=<x= 5, y=-3, z=-1>, vel=<x= 3, y=-2, z=-2>\n" +
      "pos=<x= 1, y=-2, z= 2>, vel=<x=-2, y= 5, z= 6>\n" +
      "pos=<x= 1, y=-4, z=-1>, vel=<x= 0, y= 3, z=-6>\n" +
      "pos=<x= 1, y=-4, z= 2>, vel=<x=-1, y=-6, z= 2>\n" +
      "\n" +
      "After 3 steps:\n" +
      "pos=<x= 5, y=-6, z=-1>, vel=<x= 0, y=-3, z= 0>\n" +
      "pos=<x= 0, y= 0, z= 6>, vel=<x=-1, y= 2, z= 4>\n" +
      "pos=<x= 2, y= 1, z=-5>, vel=<x= 1, y= 5, z=-4>\n" +
      "pos=<x= 1, y=-8, z= 2>, vel=<x= 0, y=-4, z= 0>\n" +
      "\n" +
      "After 4 steps:\n" +
      "pos=<x= 2, y=-8, z= 0>, vel=<x=-3, y=-2, z= 1>\n" +
      "pos=<x= 2, y= 1, z= 7>, vel=<x= 2, y= 1, z= 1>\n" +
      "pos=<x= 2, y= 3, z=-6>, vel=<x= 0, y= 2, z=-1>\n" +
      "pos=<x= 2, y=-9, z= 1>, vel=<x= 1, y=-1, z=-1>\n" +
      "\n" +
      "After 5 steps:\n" +
      "pos=<x=-1, y=-9, z= 2>, vel=<x=-3, y=-1, z= 2>\n" +
      "pos=<x= 4, y= 1, z= 5>, vel=<x= 2, y= 0, z=-2>\n" +
      "pos=<x= 2, y= 2, z=-4>, vel=<x= 0, y=-1, z= 2>\n" +
      "pos=<x= 3, y=-7, z=-1>, vel=<x= 1, y= 2, z=-2>\n" +
      "\n" +
      "After 6 steps:\n" +
      "pos=<x=-1, y=-7, z= 3>, vel=<x= 0, y= 2, z= 1>\n" +
      "pos=<x= 3, y= 0, z= 0>, vel=<x=-1, y=-1, z=-5>\n" +
      "pos=<x= 3, y=-2, z= 1>, vel=<x= 1, y=-4, z= 5>\n" +
      "pos=<x= 3, y=-4, z=-2>, vel=<x= 0, y= 3, z=-1>\n" +
      "\n" +
      "After 7 steps:\n" +
      "pos=<x= 2, y=-2, z= 1>, vel=<x= 3, y= 5, z=-2>\n" +
      "pos=<x= 1, y=-4, z=-4>, vel=<x=-2, y=-4, z=-4>\n" +
      "pos=<x= 3, y=-7, z= 5>, vel=<x= 0, y=-5, z= 4>\n" +
      "pos=<x= 2, y= 0, z= 0>, vel=<x=-1, y= 4, z= 2>\n" +
      "\n" +
      "After 8 steps:\n" +
      "pos=<x= 5, y= 2, z=-2>, vel=<x= 3, y= 4, z=-3>\n" +
      "pos=<x= 2, y=-7, z=-5>, vel=<x= 1, y=-3, z=-1>\n" +
      "pos=<x= 0, y=-9, z= 6>, vel=<x=-3, y=-2, z= 1>\n" +
      "pos=<x= 1, y= 1, z= 3>, vel=<x=-1, y= 1, z= 3>\n" +
      "\n" +
      "After 9 steps:\n" +
      "pos=<x= 5, y= 3, z=-4>, vel=<x= 0, y= 1, z=-2>\n" +
      "pos=<x= 2, y=-9, z=-3>, vel=<x= 0, y=-2, z= 2>\n" +
      "pos=<x= 0, y=-8, z= 4>, vel=<x= 0, y= 1, z=-2>\n" +
      "pos=<x= 1, y= 1, z= 5>, vel=<x= 0, y= 0, z= 2>\n" +
      "\n" +
      "After 10 steps:\n" +
      "pos=<x= 2, y= 1, z=-3>, vel=<x=-3, y=-2, z= 1>\n" +
      "pos=<x= 1, y=-8, z= 0>, vel=<x=-1, y= 1, z= 3>\n" +
      "pos=<x= 3, y=-6, z= 1>, vel=<x= 3, y= 2, z=-3>\n" +
      "pos=<x= 2, y= 0, z= 4>, vel=<x= 1, y=-1, z=-1>\n" +
      "```\n" +
      "- 위 항성계는 계속해서 스텝을 밟으며 2772 번째 스텝에서 초기와 같은 좌표와 속도를 가지게 됩니다. 따라서 주기는 2772 입니다.\n" +
      "```\n" +
      "After 0 steps:\n" +
      "pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>\n" +
      "pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>\n" +
      "pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>\n" +
      "pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>\n" +
      "\n" +
      "After 2770 steps:\n" +
      "pos=<x=  2, y= -1, z=  1>, vel=<x= -3, y=  2, z=  2>\n" +
      "pos=<x=  3, y= -7, z= -4>, vel=<x=  2, y= -5, z= -6>\n" +
      "pos=<x=  1, y= -7, z=  5>, vel=<x=  0, y= -3, z=  6>\n" +
      "pos=<x=  2, y=  2, z=  0>, vel=<x=  1, y=  6, z= -2>\n" +
      "\n" +
      "After 2771 steps:\n" +
      "pos=<x= -1, y=  0, z=  2>, vel=<x= -3, y=  1, z=  1>\n" +
      "pos=<x=  2, y=-10, z= -7>, vel=<x= -1, y= -3, z= -3>\n" +
      "pos=<x=  4, y= -8, z=  8>, vel=<x=  3, y= -1, z=  3>\n" +
      "pos=<x=  3, y=  5, z= -1>, vel=<x=  1, y=  3, z= -1>\n" +
      "\n" +
      "After 2772 steps:\n" +
      "pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>\n" +
      "pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>\n" +
      "pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>\n" +
      "pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>\n" +
      "```\n" +
      "- 주기는 때로는 매우 커다란 수가 되기도 합니다. 아래와 같은 초기상태에서는 무려 _4686774924_ 의 주기를 가집니다.\n" +
      "```\n" +
      "<x=-8, y=-10, z=0>\n" +
      "<x=5, y=5, z=10>\n" +
      "<x=2, y=-7, z=3>\n" +
      "<x=9, y=-8, z=-3>\n" +
      "```\n" +
      "- 당신의 항성계의 초기 상태가 주어졌을 때, 항성계의 주기를 계산해서 제출해주세요.\n" +
      "----",
  ];

  useEffect(() => {
    if (!storage.get("logged_in_user")) {
      history.replace("/signin");
    }
    setSuccess(false);
    setFail(false);
    setUserInput("");
    axios
      .get(`/check/prob/${match.params.prob_num}/`)
      .then((res) => {
        setProblemInput(res.data.input);
        if (res.data.solved) {
          setProblem(problems[match.params.prob_num - 1]);
        } else {
          setProblem(
            problems[match.params.prob_num - 1].replace(
              ":white_check_mark:",
              ""
            )
          );
        }
      })
      .catch((_) => {
        storage.remove("logged_in_user");
        history.replace("/signin")
      });
    axios
      .get(`/check/solvers/${match.params.prob_num}/`)
      .then((res) => {
        setSolvers(res.data.number);
      })
      .catch((_) => {
        storage.remove("logged_in_user");
        history.replace("/signin");
      });
  }, [match.params.prob_num]);

  useEffect(() => {
    if (success) {
      setProblem(problems[match.params.prob_num - 1]);
    }
    axios.get(`/check/solvers/${match.params.prob_num}/`).then((res) => {
      setSolvers(res.data.number);
    });
  }, [success]);

  const submitAnswer = () => {
    axios
      .post(`/check/prob/${match.params.prob_num}/`, { answer: userInput })
      .then((res) => {
        if (res.status === 202) {
          alert("이미 정답을 맞추셨습니다.");
          setSuccess(false);
          setFail(false);
        } else if (res.status === 200) {
          setSuccess(true);
          setFail(false);
        } else {
          setFail(true);
          setSuccess(false);
        }
      })
      .catch((error) => {
        let res = error.response;

        if (res.status === 402) {
          let remain = res.data.remain;
          alert(remain + " 초 뒤에 제출할 수 있습니다.");
        } else {
          setFail(true);
          setSuccess(false);
        }
      });
  };

  const emojiSupport = (text) =>
    text.value.replace(/:\w+:/gi, (name) => emoji.getUnicode(name));

  let markdownInputStr = "> ````\n" + problemInput + "\n````\n";
  let markdownSolverStatus =
    "#### *지금까지 총 " + solvers + "명이 성공했습니다 :fire:*\n";
  let username = storage.get("logged_in_user")

  return (
    <div>
      <Header />
      <div className="ReviewContainer">
        <ReactMarkdown source={problem} renderers={{ text: emojiSupport }} />
        <h2 className="titleTrailing">당신을 위한 입력</h2>
        <CopyToClipboard text={problemInput}>
          <p className="titleTrailing-clickable">복사하기</p>
        </CopyToClipboard>

        <ReactMarkdown source={markdownInputStr} />
        <Form success={success} error={fail} className="form">
          <h2 className="titleTrailing">제출란</h2>
          <p className="titleTrailing-clickable" onClick={submitAnswer}>
            제출하기
          </p>
          <TextArea
            placeholder="Answer"
            value={userInput}
            onChange={(target, data) => {
              setUserInput(data.value);
            }}
          />
          <Message success header="정답입니다!" content="" />
          <Message error header="정답이 아닙니다." content="" />
        </Form>
        <ReactMarkdown
          source={markdownSolverStatus}
          renderers={{ text: emojiSupport }}
        />
      </div>
    </div>
  );
}

export default Main;
