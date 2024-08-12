import React from 'react';
import SearchBar from './searchbar.js';
import ProfileRightSideBox from './profilersb.js';
import axios from 'axios';
import { useState, useEffect } from "react";


const ProfilePageContent = ({ setUsers, setAnswers, userClicked, setUserClicked, setAccountId, adminEmail, adminUsername, adminreputation, setUsername, setUsernameDisplay, setReputation, accountId, setTags, setClickedFromAnswered, setCurrentNewQuestionClicked, users, reputation, usernameDisplay, username, setProfilePage, setNewQuestionPage, setWelcomePage, setFilteredTag, setAskQuestionPageVisible, setTagPageVisible, setAnswerPageVisible, setHomePageVisible, questions, setQuestions, tags, setSearch, setSearchString, setCurrentQuestionClicked }) => {
  const [createdby, setCreatedBy] = useState(new Date());
  const [editingTagClicked, setEditingTagClicked] = useState(false)
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8000/createdBy', { params: { email: username } })
      .then(res => {
        const date = new Date(res.data.timestampOfCreation);
        setCreatedBy(date);
      }).catch(error => {
        console.error('Error fetching createdBy:', error);
      });

    if (accountId === "") {
      console.log("account type still empty")
      axios.get('http://localhost:8000/accountType', { params: { email: username } })
        .then(res => {
          setAccountType(res.data.accountType)
        }).catch(error => {
          console.error('Error fetching data:', error);
        });
    } else {
      setAccountType("admin")
    }
  }, [username, accountId]);

  const handleQuestionsClick = () => {
    setHomePageVisible(true);
    setAnswerPageVisible(false);
    setAskQuestionPageVisible(false);
    setTagPageVisible(false);
    setSearch(false);
    setFilteredTag([]);
    setProfilePage(false);
    setEditingTagClicked(false)
  };

  const handleTagsClick = () => {
    setTagPageVisible(true);
    setHomePageVisible(false);
    setAnswerPageVisible(false);
    setAskQuestionPageVisible(false);
    setSearch(false);
    setFilteredTag([]);
    setProfilePage(false);
    setEditingTagClicked(false)
  };

  const toggleSearch = (searchString) => {
    setFilteredTag([]);
    setEditingTagClicked(false)
    setSearchString(searchString);
    setSearch(true);
    setHomePageVisible(true);
    setProfilePage(false)
  };

  const toggleSignOut = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/logout')
    } catch (error) {
      alert("Sign Out Unsuccessful")
      return;
    }
    setProfilePage(false);
    setWelcomePage(true);
    setEditingTagClicked(false);
    window.location.reload();
  };

  const handleProfilePage = () => {
    setHomePageVisible(false);
    setProfilePage(true);
  };

  const handlequestiontitleclick = (item) => {
    setProfilePage(false);
    setNewQuestionPage(true);
    setCurrentNewQuestionClicked(item)
    setSearch(false);
  }

  const handleNameClick = async (itemTitle) => {
    setCurrentQuestionClicked(itemTitle);
    setProfilePage(false);
    setClickedFromAnswered(true);
    setAnswerPageVisible(true);
    setSearch(false);
    let questionId = itemTitle
    try {
      const updatedQuestionViews = await axios.put(`http://localhost:8000/questions/${questionId}/incviews`, { questionId });
      setQuestions(updatedQuestionViews.data)
      console.log("this is the response from increasing views:", updatedQuestionViews.data)
    } catch (error) {
      console.log('updating views failed')
    }
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
        <ProfileRightSideBox
          createdby={createdby}
          reputation={reputation}
          accountType={accountType}
          username={username}
          handlequestiontitleclick={handlequestiontitleclick}
          handleNameClick={handleNameClick}
          tags={tags}
          setTags={setTags}
          questions={questions}
          setQuestions={setQuestions}
          setFilteredTag={setFilteredTag}
          setHomePageVisible={setHomePageVisible}
          setProfilePage={setProfilePage}
          editingTagClicked={editingTagClicked}
          setEditingTagClicked={setEditingTagClicked}
          users={users}
          accountId={accountId}
          usernameDisplay={usernameDisplay}
          setUsername={setUsername}
          setUsernameDisplay={setUsernameDisplay}
          setReputation={setReputation}
          adminEmail={adminEmail}
          adminUsername={adminUsername}
          adminreputation={adminreputation}
          setAccountId={setAccountId}
          userClicked={userClicked}
          setUserClicked={setUserClicked}
          setUsers={setUsers}
          setAnswers={setAnswers}
          setWelcomePage={setWelcomePage}
        />
      </div>
    </div>
  );
};

export default ProfilePageContent;

