import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import './containers.css';
import './Main.css';
import {Form, Container, TextArea, Button, Message} from 'semantic-ui-react'
import Header from '../component/Header'
import ReactMarkdown from 'react-markdown'
import Footer from "../component/Footer";
import {useHistory} from "react-router-dom";


function Main({match}) {
  const [problem, setProblem] = useState("")
  const [problemInput, setProblemInput] = useState("")
  const [userInput, setUserInput] = useState("")
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [solvers, setSolvers] = useState(0)
  let history = useHistory()

  useEffect(() => {
    axios.get(`/check/prob/${match.params.prob_num}/`).then(res => {
        setProblemInput(res.data.input);
      }
    ).catch(e => {
      history.push(/signin/);
    })
    axios.get(`/check/solvers/${match.params.prob_num}/`).then(res => {
      setSolvers(res.data.number);
    })
    setProblem(
      "# Problem Number 1\n * 나나나나나나\n * 마크다운~~"
    )
    setSuccess(false)
    setFail(false)
    setUserInput("")
  }, [match.params.prob_num])

  const submitAnswer = () => {
    axios.post(`/check/prob/${match.params.prob_num}/`, {'answer': userInput}).then(res => {
      if (res.status === 202) {
        alert("이미 정답을 맞추셨습니다.");
        setSuccess(false)
        setFail(false)
      } else if (res.status === 200) {
        setSuccess(true)
        setFail(false)
      } else {
        setFail(true)
        setSuccess(false)
      }
    }).catch(res => {
      setFail(true)
      setSuccess(false)
    })
  }

  return (
    <div>
      <Header/>
      <div className="ReviewContainer">
        <ReactMarkdown source={problem}/>
        <div>
          <h4>맞춘 사람 : {solvers}</h4>
        </div>
        <Form success={success} error={fail} className="form">
          <h2>
            INPUT
          </h2>
          <Container textAlign='left'>
            <p style={{'word-break': 'break-all'}}>
              {problemInput}
            </p>
          </Container>
          <TextArea placeholder='Answer' value={userInput} onChange={(target, data) => {
            setUserInput(data.value)
          }}/>
          <Form.Button labelPosition="right" attached="right" onClick={submitAnswer}>제출</Form.Button>
          <Message
            success
            header='정답입니다!'
            content=""
          />
          <Message
            error
            header='정답이 아닙니다.'
            content=''
          />
        </Form>
      </div>
      <Footer/>
    </div>
  );
}

export default Main;
