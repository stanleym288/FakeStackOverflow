import { useState } from 'react'
import React from 'react';
import RightSideBox from './rightsidebox.js'
import SearchBar from './searchbar.js';
import axios from 'axios';


const HomePageContent = ({ username,  usernameDisplay, setProfilePage, filteredTag, setWelcomePage, setFilteredTag, setAskQuestionPageVisible, setTagPageVisible, setAnswerPageVisible, setHomePageVisible, questions, setQuestions, answers, tags, searchOn, setSearch, searchString, setSearchString, setCurrentQuestionClicked }) => {
  const [newestButtonToggle, setNewestButtonToggle] = useState(true);
  const [activeButtonToggle, setActiveButtonToggle] = useState(false);
  const [unansweredButtonToggle, setUnansweredButtonToggle] = useState(false);

  const toggleNewest = () => {
    setFilteredTag([]);
    setNewestButtonToggle(true);
    setActiveButtonToggle(false);
    setUnansweredButtonToggle(false);
  }

  const toggleActive = () => {
    setFilteredTag([]);
    setNewestButtonToggle(false);
    setActiveButtonToggle(true);
    setUnansweredButtonToggle(false);
  }

  const toggleUnanswered = () => {
    setFilteredTag([]);
    setNewestButtonToggle(false);
    setActiveButtonToggle(false);
    setUnansweredButtonToggle(true);
  }

  const handleQuestionsClick = () => {
    setHomePageVisible(true);
    setAnswerPageVisible(false);
    setAskQuestionPageVisible(false);
    setTagPageVisible(false);
    setSearch(false);
    setFilteredTag([]);
    toggleNewest();
  };

  const handleTagsClick = () => {
    setTagPageVisible(true);
    setHomePageVisible(false);
    setAnswerPageVisible(false);
    setAskQuestionPageVisible(false);
    setSearch(false);
    setFilteredTag([]);
  };

  const toggleSearch = (searchString) => {
    setFilteredTag([]);
    setSearchString(searchString);
    setSearch(true);
  };

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
    setSearch(false)
    window.location.reload();
  };

  const handleProfilePage = () => {
    setHomePageVisible(false);
    setProfilePage(true);
    setFilteredTag([]);
    setSearch(false);
  };

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
        <button className={"active hyperlinkButton"} onClick={handleQuestionsClick}>Questions</button>
        <button className={"hyperlinkButton"} onClick={handleTagsClick}>Tags</button>
      </div>
      <div className="right-side-box">
        <RightSideBox
          questions={questions}
          answers={answers}
          tags={tags}
          newest={newestButtonToggle}
          active={activeButtonToggle}
          unanswered={unansweredButtonToggle}
          setnewest={toggleNewest}
          setactive={toggleActive}
          setunanswered={toggleUnanswered}
          setHomePageVisible={setHomePageVisible}
          setAskQuestionPageVisible={setAskQuestionPageVisible}
          setAnswerPageVisible={setAnswerPageVisible}
          setTagPageVisible={setTagPageVisible}
          searchString={searchString}
          searchOn={searchOn}
          filteredTag={filteredTag}
          setFilteredTag={setFilteredTag}
          setSearch={setSearch}
          setCurrentQuestionClicked={setCurrentQuestionClicked}
          setQuestions={setQuestions}
        />
      </div>
    </div>
  );
};

export default HomePageContent;

