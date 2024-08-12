import React from 'react';
import SearchBar from './searchbar.js';
import axios from 'axios';
import { useState, useEffect } from "react";


const NewQuestionPageContent = ({ setAnswers, setTags, currentNewQuestionClicked, setCurrentNewQuestionClicked, reputation, usernameDisplay, username, setProfilePage, setNewQuestionPage, setWelcomePage, setFilteredTag, setAskQuestionPageVisible, setTagPageVisible, setAnswerPageVisible, setHomePageVisible, setQuestions, tags, setSearch, setSearchString }) => {
    const [questionTitle, setQuestionTitle] = useState(currentNewQuestionClicked.title);
    const [questionText, setQuesitonText] = useState(currentNewQuestionClicked.text);
    const [questionTags, setQuesitonTags] = useState('');
    const [questionSummary, setQuestionSummary] = useState(currentNewQuestionClicked.summary);

    useEffect(() => {
        axios.get('http://localhost:8000/gettags', { params: { tags: currentNewQuestionClicked.tags } })
            .then(res => {
                setQuesitonTags(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
    }, [currentNewQuestionClicked.tags]);

    const handleQuestionsClick = () => {
        setHomePageVisible(true);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setSearch(false);
        setFilteredTag([]);
        setNewQuestionPage(false);
    };

    const handleTagsClick = () => {
        setTagPageVisible(true);
        setHomePageVisible(false);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setSearch(false);
        setFilteredTag([]);
        setNewQuestionPage(false);
    };

    const toggleSearch = (searchString) => {
        setFilteredTag([]);
        setSearchString(searchString);
        setSearch(true);
        setHomePageVisible(true);
      };
    
    const toggleSignOut = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/logout')
        } catch (error) {
            alert("Sign Out Unsuccessful")
            return;
        }
        setNewQuestionPage(false);
        setWelcomePage(true);
        setCurrentNewQuestionClicked([]);
        window.location.reload();
    };

    const handleProfilePage = () => {
        setNewQuestionPage(false);
        setProfilePage(true);
    };

    const newTitle = (event) => {
        setQuestionTitle(event.target.value);
    }

    const newSummary = (event) => {
        setQuestionSummary(event.target.value)
    }

    const newText = (event) => {
        setQuesitonText(event.target.value);
    }

    const newTags = (event) => {
        setQuesitonTags(event.target.value);
    }

    const deleteQuestion = async (e) => {
        e.preventDefault();  
        let questionId = currentNewQuestionClicked._id
        let questionAnswers = currentNewQuestionClicked.answers
        let questionComments = currentNewQuestionClicked.comments
        try {
            const response = await axios.post('http://localhost:8000/deletequestion', {questionId, questionAnswers, questionComments})
            const updatedQuestions = response.data.questions;
            const updatedAnswers = response.data.answers;
            setQuestions(updatedQuestions)
            setAnswers(updatedAnswers)
        } catch (error) {
            console.error('Error adding question client:', error);
            return
        }
        setNewQuestionPage(false);
        setHomePageVisible(true);
    }

    const updateQuestion = async (e) => {
        e.preventDefault();
        let title = questionTitle.toLowerCase();
        let text = questionText.toLowerCase();
        let tag = questionTags.toLowerCase();
        let summary = questionSummary.toLowerCase();
        var taglist = tag.split(" ")
        
        // remove duplicates
        taglist = taglist.filter((tag, index) => taglist.indexOf(tag) === index)

        // remove empty strings
        taglist = taglist.filter(item => item !== "")

        // check if title is zero or over 100 characters
        var error = 0

        if ((title.length === 0) || (title.length > 50)) {
            error += 1
        }

        if ((summary.length === 0 || (summary.length > 140))) {
            error += 1
        }

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

        // check if the taglist is invalid
        if (taglist.length > 5) {
            error += 1
        } else if (taglist.length === 0) {
            error += 1
        } else {
            for (var i = 0; i < taglist.length; i++) {
                if (taglist[i].length > 20) {
                    error += 1
                }
            }
        }

        const invalidTags = taglist.filter(tag => !tags.some(existingTag => existingTag.name === tag));
        if (invalidTags.length > 0) {
            if (reputation < 50) {
                error += 1
            }
        }

        // if there are any errors return
        if (error > 0) {
            return
        }

        // edit the tags to remove user
        let originalTags = currentNewQuestionClicked.tags
        let arrayofTags = []

        try {
            const response = await axios.post('http://localhost:8000/updatetags', { originalTags, username })
            arrayofTags = response.data
        } catch (error) {
            console.error('Error adding question client:', error);
            return
        }

        console.log("this is reached")

        let listofnamemymodel = [];
        let newTagIds = []

        for (let i = 0; i < arrayofTags.length; i++) {
            listofnamemymodel.push(arrayofTags[i].name)
        }

        let currentListofTags;

        for (let i = 0; i < taglist.length; i++) {
            if (listofnamemymodel.includes(taglist[i])) { // if the tag is already in the mymodel tag
                newTagIds.push(arrayofTags[listofnamemymodel.indexOf(taglist[i])]._id) // push the id number
                let tagId = arrayofTags[listofnamemymodel.indexOf(taglist[i])]._id
                try {
                    const response = await axios.post('http://localhost:8000/addtaguser', { tagId, username})
                    const updatedTags = response.data;
                    currentListofTags = updatedTags
                    setTags(updatedTags)
                } catch (error) {
                    console.error('Error adding question client:', error);
                    return
                }
            } else { // update the model and push the new id tag
                let name = taglist[i];
                try {
                    const response = await axios.post('http://localhost:8000/addtag', { name, username })
                    const updatedTags = response.data;
                    currentListofTags = updatedTags
                    setTags(updatedTags)
                } catch (error) {
                    console.error('Error adding question client:', error);
                    return
                }

                console.log("tag after post question new array", currentListofTags)

                let newTag = currentListofTags[currentListofTags.length - 1]
                newTagIds.push(newTag._id)

                console.log("this is the id of the tag", newTag._id)
            }
        }
        // update the new question with tags
        let questionId = currentNewQuestionClicked._id
        
        try {
            const response = await axios.post('http://localhost:8000/updateQuestion', {questionId, title, text, newTagIds, summary})
            const updatedQuestion = response.data;
            setQuestions(updatedQuestion)
        } catch (error) {
            console.error('Error adding question client:', error);
            return
        }

        setNewQuestionPage(false);
        setHomePageVisible(true);
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
                <div style={{ height: "17%", display: "flex", borderBottom: "solid" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        <button style={{ margin: "6%" }} onClick={updateQuestion}>Update Question</button>
                    </div>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        <button style={{ margin: "6%" }} onClick={deleteQuestion}>Delete Question</button>
                    </div>
                </div>
                <div style={{ margin: '20px', height: '60vh', maxHeight: '60vh', overflow: 'auto' }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '75%' }}>
                            <p style={{ marginLeft: '40px', color: 'red', fontFamily: 'Helvetica' }}>*Indicates mandatory fields</p>
                        </div>
                    </div>
                    <form>
                        <h1 style={{ fontSize: '25px', marginLeft: '70px', marginTop: '0px', marginBottom: '0px' }}> Question Title* </h1>
                        <i style={{ fontSize: '15px', marginLeft: '70px' }}>Limit title to 50 characters or less</i><br />
                        <input style={{ fontFamily: "'Times New Roman', Times, serif" }} id="questionTitle" value={questionTitle} onChange={newTitle} />
                        <ErrorTitle questionTitle={questionTitle} />

                        <h1 style={{ fontSize: '25px', marginLeft: '70px', marginTop: '0px', marginBottom: '0px' }}> Question Summary* </h1>
                        <i style={{ fontSize: '15px', marginLeft: '70px' }}>Limit title to 140 characters or less</i><br />
                        <textarea style={{ fontFamily: "'Times New Roman', Times, serif" }} id="questionText" value={questionSummary} onChange={newSummary}></textarea>
                        <ErrorSummary questionSummary={questionSummary} />

                        <h1 style={{ fontSize: '25px', marginLeft: '70px', marginTop: '0px', marginBottom: '0px' }}> Question Text* </h1>
                        <i style={{ fontSize: '15px', marginLeft: '70px' }}>Add details</i><br />
                        <textarea style={{ fontFamily: "'Times New Roman', Times, serif" }} id="questionText" value={questionText} onChange={newText}></textarea>
                        <ErrorText questionText={questionText} />

                        <h1 style={{ fontSize: '25px', marginLeft: '70px', marginTop: '0px', marginBottom: '0px' }}> Tags* </h1>
                        <i style={{ fontSize: '15px', marginLeft: '70px' }}>Add Keywords separated by whitespace</i><br />
                        <input style={{ fontFamily: "'Times New Roman', Times, serif" }} id="tags" value={questionTags} onChange={newTags} />
                        <ErrorTags questionTags={questionTags} reputation={reputation} tags={tags} />
                    </form>
                </div>
            </div>
        </div>
    );
};

const ErrorTitle = ({ questionTitle }) => {
    if ((questionTitle.length === 0) || (questionTitle.length > 50)) {
        return <p className="error">Invalid Title Length</p>
    }
}

const ErrorSummary = ({ questionSummary }) => {
    if ((questionSummary.length === 0) || (questionSummary.length > 140)) {
        return <p className="error">Invalid Summary Length</p>
    }
}

const ErrorText = ({ questionText }) => {
    if (questionText.length === 0) {
        return <p className="error">Invalid Text Length</p>
    }

    // obtain hypertext in the text
    let hypertextarray = questionText.match(/(\[.*?\]\(.*?\))/g);

    // if the hypertext exists
    if (hypertextarray) {
        for (let i = 0; i < hypertextarray.length; i++) {
            let match = hypertextarray[i].match(/\[(.*?)\]\((.*?)\)/);
            let bracketText = match[1];
            let parentesesText = match[2];

            if (bracketText.length === 0) {
                return <p className="error"> Invalid Bracket Text</p>;
            }

            //check for invaild links
            if (parentesesText.length === 0) {
                return <p className="error"> Invalid Link </p>;
            }

            if (parentesesText.startsWith("http://") || parentesesText.startsWith("https://")) {
                return;
            } else {
                return <p className="error"> Invalid Link </p>
            }
        }
    }
}

const ErrorTags = ({ questionTags, reputation, tags }) => {
    let tag = questionTags.toLowerCase();
    var taglist = tag.split(" ");

    // remove duplicates
    taglist = taglist.filter((tag, index) => taglist.indexOf(tag) === index)

    // remove empty strings
    taglist = taglist.filter(item => item !== "")



    if (taglist.length > 5) {
        return <p className="error">Too Many Tags</p>;
    } else if (taglist.length === 0) {
        return <p className="error">There Must be at Least 1 Tag</p>;
    } else {
        for (let i = 0; i < taglist.length; i++) {
            if (taglist[i].length > 20) {
                return <p className="error">Tag is Too Long</p>;
            }
        }
    }

    // Check if any tag added by the user doesn't exist in the 'tags' array
    const invalidTags = taglist.filter(tag => !tags.some(existingTag => existingTag.name === tag));
    if (invalidTags.length > 0) {
        if (reputation < 50) {
            return <p className="error">Reputation below 50, can not add new tags</p>;
        }
    }
}

export default NewQuestionPageContent;