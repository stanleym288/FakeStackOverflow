import SearchBar from "./searchbar";
import React from "react";
import { useState } from 'react';
import axios from 'axios';

const AnswerQuestion = ({ setClickedFromAnswered, username, usernameDisplay, setQuestions, setAnswers, setFilteredTag, setAnswerQuestionVisible, currentQuestionClicked, setHomePageVisible, setAskQuestionPageVisible, setTagPageVisible, setAnswerPageVisible, setSearch, setSearchString }) => {

    const handleQuestionsClick = () => {
        setHomePageVisible(true);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setAnswerQuestionVisible(false);
        setFilteredTag([]);
        setClickedFromAnswered(false)
    };

    const handleTagsClick = () => {
        setHomePageVisible(false);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setTagPageVisible(true);
        setAnswerQuestionVisible(false);
        setFilteredTag([]);
        setClickedFromAnswered(false)
    };

    const toggleSearch = (searchString) => {
        setFilteredTag([]);
        setSearchString(searchString);
        setSearch(true);
        setHomePageVisible(true);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setAnswerQuestionVisible(false);
        setClickedFromAnswered(false)
    };
    const [answerText, setAnswerText] = useState('');

    const newAnswerText = (event) => {
        setAnswerText(event.target.value);
    }

    const toggleAnswerQuestion = async () => {
        let text = answerText.toLowerCase();
        let email = username
        setAnswerText('');

        // check if title is zero or over 100 characters
        var error = 0

        // check if the text box is empty
        if (text.length === 0) {
            error += 1
        }

        // obtain hypertext in the text
        let hypertextarray = text.match(/(\[.*?\]\(.*?\))/g);
        // if the hypertext exists
        if (hypertextarray) {
            for (let i = 0; i < hypertextarray.length; i++) {
                let match = hypertextarray[i].match(/\[(.*?)\]\((.*?)\)/);
                let bracketText = match[1]
                let parentesesText = match[2];

                if (bracketText.length === 0) {
                    error += 1
                }

                //check for invaild links
                if (parentesesText.length === 0) {
                    error += 1
                }

                if (parentesesText.startsWith("http://") || parentesesText.startsWith("https://")) {
                } else {
                    error += 1
                }
            }
        }


        // if there are any errors return
        if (error > 0) {
            return
        }

        let currentListofAnswers;

        try {
            // add answer to list of answers
            const response = await axios.post('http://localhost:8000/addanswer', { text, usernameDisplay, email})
            currentListofAnswers = response.data
            setAnswers(response.data)

            // update the list of of answers for that question
            let questionId = currentQuestionClicked
            console.log("this is the questionId", questionId)
            let answer = currentListofAnswers[currentListofAnswers.length - 1]
            const updatedQuestionAnswers = await axios.put(`http://localhost:8000/questions/${questionId}/updateanswers`, { questionId, answer })
            setQuestions(updatedQuestionAnswers.data)
        } catch (error) {
            alert("error adding answer")
        }

        console.log(currentListofAnswers)

        setHomePageVisible(false)
        setAnswerPageVisible(true)
        setAskQuestionPageVisible(false)
        setTagPageVisible(false)
        setAnswerQuestionVisible(false)
        setSearch(false)

    }

    return (
        <div className="grid-container">
            <div className="header-stack">
                <h1 style={{ width: '85%', fontSize: '50px', textAlign: 'center' }}> FakeStackOverflow </h1>
                <SearchBar onSearch={toggleSearch} />
            </div>
            <div className="left-side-bar">
                <button className={"hyperlinkButton"} onClick={handleQuestionsClick}>Questions</button>
                <br />
                <button className={"hyperlinkButton"} onClick={handleTagsClick}>Tags</button>
            </div>
            <div style={{ margin: '20px', maxHeight: '90vh' }}>
                <form>
                    <h1 style={{ fontSize: '25px', marginLeft: '70px', marginBottom: '0px', marginTop: '50px' }}> Answer Text* </h1>
                    <textarea style={{ fontFamily: 'Times New Roman, Times, serif', marginLeft: '50px', width: '600px', height: '350px' }} value={answerText} onChange={newAnswerText}></textarea>
                    <ErrorText questionText={answerText} />
                    <br />
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '30%' }}> <button type="button" className="button1post" onClick={toggleAnswerQuestion}>Post
                            Answer</button> </div>
                        <div style={{ width: '50%' }}>
                            <p style={{ margin: '0px', marginTop: '10px', color: 'red', fontFamily: 'Helvetica' }}>*Indicates mandatory fields</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

const ErrorText = ({ questionText }) => {
    if (questionText.length === 0) {
        return <p className="error" style={{ paddingLeft: '50px' }}>Invalid Text Length</p>
    }

    // obtain hypertext in the text
    let hypertextarray = questionText.match(/(\[.*?\]\(.*?\))/g);

    // if the hypertext exists
    if (hypertextarray) {
        for (let i = 0; i < hypertextarray.length; i++) {
            let match = hypertextarray[i].match(/\[(.*?)\]\((.*?)\)/);
            let bracketText = match[1]
            let parentesesText = match[2];

            if (bracketText.length === 0) {
                return <p className="error" style={{ paddingLeft: '50px' }}> Invalid Bracket Text </p>;
            }

            //check for invaild links
            if (parentesesText.length === 0) {
                return <p className="error" style={{ paddingLeft: '50px' }}> Invalid Link </p>;
            }

            if (parentesesText.startsWith("http://") || parentesesText.startsWith("https://")) {
                return;
            } else {
                return <p className="error" style={{ paddingLeft: '50px' }}> Invalid Link </p>
            }
        }
    }
}


export default AnswerQuestion