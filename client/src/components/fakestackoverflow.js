import React, { useState, useEffect } from 'react';
import HomePageContent from './homepagecontent.js';
import AskQuestionContent from './askquestions.js';
import TagPageContent from './tagpage.js';
import AnswerPageContent from './answerpage.js'
import AnswerQuestion from './ansquestion.js';
import axios from 'axios';
import LogInContent from "./login";
import ContinueAsGuestContent from "./continueasguest";
import SignUpContent from "./signup";
import WelcomePageContent from "./welcomepage";
import ProfilePageContent from './profile.js';
import NewQuestionPageContent from './newquestion.js';


axios.defaults.withCredentials = true

const EntireFakeStackOverflow = () => {
  // model got from the database
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredTag, setFilteredTag] = useState([]);

  // check if the user is authenciated
  const [username, setUsername] = useState("");
  // username not email
  const [usernameDisplay, setUsernameDisplay] = useState('');
  const [reputation, setReputation] = useState("");
  const [accountId, setAccountId] = useState("")
  const [userClicked, setUserClicked] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(res => {
        setUsers(res.data);
        console.log("users", res.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/questions')
      .then(res => {
        setQuestions(res.data);
        console.log("questions", res.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/answers')
      .then(res => {
        setAnswers(res.data);
        console.log("answers", res.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/tags')
      .then(res => {
        setTags(res.data);
        console.log("tags", res.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then(res => {
        console.log("this is what is in the jwt", res.data)
        setUsername(res.data.user.email)
        setUsernameDisplay(res.data.user.username)
        let email = res.data.user.email;

        axios.get('http://localhost:8000/reputation', { params: { email } })
          .then(res => {
            setReputation(res.data.reputation)
          }).catch(error => {
            console.error('Error fetching data:', error);
          });

        setHomePageVisible(true)
        setWelcomePage(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // different pages being shown
  const [showHomePage, setHomePageVisible] = useState(false);
  const [showAskQuestionPage, setAskQuestionPageVisible] = useState(false);
  const [showTagPage, setTagPageVisible] = useState(false);
  const [showAnswerPage, setAnswerPageVisible] = useState(false);
  const [showAnswerQuestionPage, setAnswerQuestionVisible] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showContinueAsGuest, setShowContinueAsGuest] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showWelcomePage, setWelcomePage] = useState(true);
  const [showProfilePage, setProfilePage] = useState(false);
  const [showNewQuestionPage, setNewQuestionPage] = useState(false);

  // this will be the state of the search bar
  const [searchOn, setSearch] = useState(false);
  const [searchString, setSearchString] = useState('');

  // this will house the state of the question if clicked from main page
  const [currentQuestionClicked, setCurrentQuestionClicked] = useState('');
  // this will house the state of the new question clicked from the proflie page
  const [currentNewQuestionClicked, setCurrentNewQuestionClicked] = useState([]);
  // this will house the state of the answered question clicked form the proflie page
  const [clickedFromAnswered, setClickedFromAnswered] = useState(false)
  const [editQuestionClick, setEditQuesitonClick] = useState(false)

  return (
    <div>
      {showHomePage && <HomePageContent
        setWelcomePage={setWelcomePage}
        setHomePageVisible={setHomePageVisible}
        setTagPageVisible={setTagPageVisible}
        setAskQuestionPageVisible={setAskQuestionPageVisible}
        setAnswerPageVisible={setAnswerPageVisible}
        questions={questions}
        setQuestions={setQuestions}
        answers={answers}
        tags={tags}
        searchOn={searchOn}
        setSearch={setSearch}
        searchString={searchString}
        setSearchString={setSearchString}
        setCurrentQuestionClicked={setCurrentQuestionClicked}
        setFilteredTag={setFilteredTag}
        filteredTag={filteredTag}
        username={username}
        usernameDisplay={usernameDisplay}
        setProfilePage={setProfilePage}
      />}
      {showTagPage && <TagPageContent
        usernameDisplay={usernameDisplay}
        setProfilePage={setProfilePage}
        username={username}
        setWelcomePage={setWelcomePage}
        setHomePageVisible={setHomePageVisible}
        setTagPageVisible={setTagPageVisible}
        setAskQuestionPageVisible={setAskQuestionPageVisible}
        setAnswerPageVisible={setAnswerPageVisible}
        questions={questions}
        answers={answers}
        tags={tags}
        searchOn={searchOn}
        setSearch={setSearch}
        searchString={searchString}
        setSearchString={setSearchString}
        setFilteredTag={setFilteredTag}
      />}
      {showAskQuestionPage && <AskQuestionContent
        usernameDisplay={usernameDisplay}
        setProfilePage={setProfilePage}
        reputation={reputation}
        username={username}
        setHomePageVisible={setHomePageVisible}
        setTagPageVisible={setTagPageVisible}
        setAskQuestionPageVisible={setAskQuestionPageVisible}
        setAnswerPageVisible={setAnswerPageVisible}
        questions={questions}
        answers={answers}
        tags={tags}
        setTags={setTags}
        setQuestions={setQuestions}
        searchOn={searchOn}
        setSearch={setSearch}
        searchString={searchString}
        setSearchString={setSearchString}
        setFilteredTag={setFilteredTag}
        setWelcomePage={setWelcomePage}
      />}
      {showAnswerPage && <AnswerPageContent
        setProfilePage={setProfilePage}
        setHomePageVisible={setHomePageVisible}
        setTagPageVisible={setTagPageVisible}
        setWelcomePage={setWelcomePage}
        usernameDisplay={usernameDisplay}
        reputation={reputation}
        setAskQuestionPageVisible={setAskQuestionPageVisible}
        setAnswerPageVisible={setAnswerPageVisible}
        setAnswerQuestionVisible={setAnswerQuestionVisible}
        questions={questions}
        setQuestions={setQuestions}
        answers={answers}
        setAnswers={setAnswers}
        tags={tags}
        searchString={searchString}
        setSearch={setSearch}
        setSearchString={setSearchString}
        currentQuestionClicked={currentQuestionClicked}
        setFilteredTag={setFilteredTag}
        username={username}
        clickedFromAnswered={clickedFromAnswered}
        setClickedFromAnswered={setClickedFromAnswered}
        editQuestionClick={editQuestionClick}
        setEditQuesitonClick={setEditQuesitonClick}
        setReputation={setReputation}
      />}
      {showAnswerQuestionPage && <AnswerQuestion
        setProfilePage={setProfilePage}
        setHomePageVisible={setHomePageVisible}
        setTagPageVisible={setTagPageVisible}
        setAskQuestionPageVisible={setAskQuestionPageVisible}
        setAnswerPageVisible={setAnswerPageVisible}
        setAnswerQuestionVisible={setAnswerQuestionVisible}
        questions={questions}
        setQuestions={setQuestions}
        answers={answers}
        setAnswers={setAnswers}
        tags={tags}
        searchOn={searchOn}
        setSearch={setSearch}
        searchString={searchString}
        setSearchString={setSearchString}
        currentQuestionClicked={currentQuestionClicked}
        setFilteredTag={setFilteredTag}
        usernameDisplay={usernameDisplay}
        username={username}
        setClickedFromAnswered={setClickedFromAnswered}
      />}
      {showWelcomePage && <WelcomePageContent
        setWelcomePage={setWelcomePage}
        setHomePageVisible={setHomePageVisible}
        setShowLogIn={setShowLogIn}
        setShowContinueAsGuest={setShowContinueAsGuest}
        setShowSignUp={setShowSignUp}
        setUsername={setUsername}
        setUsernameDisplay={setUsernameDisplay}
      />}
      {showLogIn && <LogInContent
        setHomePageVisible={setHomePageVisible}
        setShowLogIn={setShowLogIn}
        setUsername={setUsername}
        setUsernameDisplay={setUsernameDisplay}
        setReputation={setReputation}
        setWelcomePage={setWelcomePage}
      />}
      {showContinueAsGuest && <ContinueAsGuestContent
        setHomePageVisible={setHomePageVisible}
        setShowContinueAsGuest={setShowContinueAsGuest}
      />}
      {showSignUp && <SignUpContent
        setShowSignUp={setShowSignUp}
        setHomePageVisible={setHomePageVisible}
        setShowLogIn={setShowLogIn}
        setWelcomePage={setWelcomePage}
      />}
      {showProfilePage && <ProfilePageContent
        users={users}
        usernameDisplay={usernameDisplay}
        setWelcomePage={setWelcomePage}
        reputation={reputation}
        setHomePageVisible={setHomePageVisible}
        setTagPageVisible={setTagPageVisible}
        setAskQuestionPageVisible={setAskQuestionPageVisible}
        setAnswerPageVisible={setAnswerPageVisible}
        questions={questions}
        setQuestions={setQuestions}
        setAnswers={setAnswers}
        setUsers={setUsers}
        answers={answers}
        tags={tags}
        setTags={setTags}
        searchOn={searchOn}
        setSearch={setSearch}
        searchString={searchString}
        setSearchString={setSearchString}
        setCurrentQuestionClicked={setCurrentQuestionClicked}
        setFilteredTag={setFilteredTag}
        filteredTag={filteredTag}
        username={username}
        setProfilePage={setProfilePage}
        setNewQuestionPage={setNewQuestionPage}
        setCurrentNewQuestionClicked={setCurrentNewQuestionClicked}
        setClickedFromAnswered={setClickedFromAnswered}
        accountId={accountId}
        setUsernameDisplay={setUsernameDisplay}
        setUsername={setUsername}
        setReputation={setReputation}
        setAccountId={setAccountId}
        userClicked={userClicked}
        setUserClicked={setUserClicked}
      />}

      {showNewQuestionPage && <NewQuestionPageContent
        users={users}
        usernameDisplay={usernameDisplay}
        setWelcomePage={setWelcomePage}
        reputation={reputation}
        setHomePageVisible={setHomePageVisible}
        setTagPageVisible={setTagPageVisible}
        setAskQuestionPageVisible={setAskQuestionPageVisible}
        setAnswerPageVisible={setAnswerPageVisible}
        questions={questions}
        setQuestions={setQuestions}
        answers={answers}
        tags={tags}
        searchOn={searchOn}
        setSearch={setSearch}
        searchString={searchString}
        setSearchString={setSearchString}
        setCurrentQuestionClicked={setCurrentQuestionClicked}
        setFilteredTag={setFilteredTag}
        filteredTag={filteredTag}
        username={username}
        setProfilePage={setProfilePage}
        setNewQuestionPage={setNewQuestionPage}
        currentNewQuestionClicked={currentNewQuestionClicked}
        setCurrentNewQuestionClicked={setCurrentNewQuestionClicked}
        setTags={setTags}
        setAnswers={setAnswers}
      />}
    </div>
  );
};

export default EntireFakeStackOverflow;

