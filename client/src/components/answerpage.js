import React from "react";
import SearchBar from './searchbar';
import AnswerDisplayQuestion from "./ansdisplayquestion";
import EditAnswer from "./ansedit";
import axios from 'axios';
import { useState } from "react";

const AnswerPageContent = ({ editQuestionClick, setEditQuesitonClick, setClickedFromAnswered, clickedFromAnswered, setProfilePage, usernameDisplay, username, setWelcomePage, reputation, setFilteredTag, setAnswerQuestionVisible, setHomePageVisible, setAskQuestionPageVisible, setTagPageVisible, setAnswerPageVisible, questions, answers, tags, setQuestions, setAnswers, currentQuestionClicked, setSearchString, setSearch }) => {
  const [currentAnswerClicked, setCurrentAnswerClicked] = useState("")
  const handleQuestionsClick = () => {
    setHomePageVisible(true);
    setAskQuestionPageVisible(false);
    setTagPageVisible(false);
    setAnswerPageVisible(false);
    setFilteredTag([])
    setClickedFromAnswered(false)
    setEditQuesitonClick(false);
  };

  const handleTagsClick = () => {
    setHomePageVisible(false);
    setAskQuestionPageVisible(false);
    setTagPageVisible(true);
    setAnswerPageVisible(false);
    setFilteredTag([])
    setClickedFromAnswered(false)
    setEditQuesitonClick(false);
  };

  const toggleSearch = (searchString) => {
    setSearchString(searchString)
    setSearch(true);
    setAnswerPageVisible(false);
    setHomePageVisible(true);
    setFilteredTag([]);
    setClickedFromAnswered(false)
    setEditQuesitonClick(false);
  };

  const handleAnsQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/addquestionclick')
    } catch (error) {
      alert("Answer Question Unsuccessful Please Sign In")
      return;
    }
    setHomePageVisible(false);
    setAskQuestionPageVisible(false);
    setTagPageVisible(false);
    setAnswerPageVisible(false);
    setAnswerQuestionVisible(true);
    setEditQuesitonClick(false);
  }

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/addquestionclick')
    } catch (error) {
      alert("Add Question Unsuccessful Please Sign In")
      return;
    }
    setAskQuestionPageVisible(true);
    setAnswerPageVisible(false);
    setHomePageVisible(false);
    setTagPageVisible(false);
    setClickedFromAnswered(false)
    setEditQuesitonClick(false);
  }

  const toggleSignOut = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/logout')
    } catch (error) {
      alert("Sign Out Unsuccessful")
      return;
    }
    setHomePageVisible(false);
    setWelcomePage(true);
    setClickedFromAnswered(false)
    setEditQuesitonClick(false);
    window.location.reload();
  };

  const handleProfilePage = () => {
    setAnswerPageVisible(false);
    setProfilePage(true);
    setClickedFromAnswered(false)
    setEditQuesitonClick(false);
  };

  const handleEditAnswer = (answer) => {
    setCurrentAnswerClicked(answer)
    setEditQuesitonClick(true);
  }

  return (
    <div className="grid-container">
      <div className="header-stack">
        <h1 style={{ width: '50%', fontSize: '50px', textAlign: 'center' }}> FakeStackOverflow </h1>
        <h4 style={{ marginTop: '65px', marginRight: '20px' }}>Hello, {usernameDisplay}</h4>
        {username !== "Guest" ? (
          <>
            <button className="hyperlinkButton" onClick={handleProfilePage} style={{ marginRight: "6px" }}>Profile</button>
            <button className="hyperlinkButton" onClick={toggleSignOut} style={{ width: '80px', marginRight: '100px' }}>Sign Out</button>
          </>
        ) : (
          <button className="hyperlinkButton" onClick={toggleSignOut} style={{ width: '100px', marginRight: '100px' }}>Sign in/Sign up</button>
        )}
        <SearchBar onSearch={toggleSearch} />
      </div>
      <div className="left-side-bar">
        <button className={"hyperlinkButton"} onClick={handleQuestionsClick}>Questions</button>
        <br />
        <button className={"hyperlinkButton"} onClick={handleTagsClick}>Tags</button>
      </div>
      <div className="right-side-box">
        {!editQuestionClick && <AnswerDisplayQuestion
          reputation={reputation}
          handleAnsQuestion={handleAnsQuestion}
          handleAskQuestion={handleAskQuestion}
          username={username}
          currentQuestionClicked={currentQuestionClicked}
          questions={questions}
          answers={answers}
          tags={tags}
          setQuestions={setQuestions}
          setAnswers={setAnswers}
          usernameDisplay={usernameDisplay}
          clickedFromAnswered={clickedFromAnswered}
          setClickedFromAnswered={setClickedFromAnswered}
          handleEditAnswer={handleEditAnswer}
        />}
        {editQuestionClick && <EditAnswer
          setQuestions={setQuestions}
          setAnswers={setAnswers}
          currentAnswerClicked={currentAnswerClicked}
          setEditQuesitonClick={setEditQuesitonClick}
        />}
      </div>
    </div>
  );
};

export default AnswerPageContent;