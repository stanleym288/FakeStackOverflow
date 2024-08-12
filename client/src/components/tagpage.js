import React from 'react';
import SearchBar from './searchbar';
import { useState, useEffect } from 'react';
import axios from 'axios';


const TagPageContent = ({ username, usernameDisplay, setProfilePage, setWelcomePage, tags, questions, setHomePageVisible, setAskQuestionPageVisible, setTagPageVisible, setFilteredTag, setAnswerPageVisible, setSearchString, setSearch }) => {
    const handleQuestionsClick = () => {
        setHomePageVisible(true);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setAnswerPageVisible(false);
        setSearch(false);
        setFilteredTag([]);
    };

    const handleProfilePage = () => {
        setTagPageVisible(false);
        setProfilePage(true);
    };

    const handleTagsClick = () => {
        setHomePageVisible(false);
        setTagPageVisible(true);
        setAnswerPageVisible(false);
        setSearch(false);
        setFilteredTag([]);
    };

    const toggleSearch = (searchString) => {
        setFilteredTag([]);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setAnswerPageVisible(false);
        setSearchString(searchString);
        setSearch(true);
        setHomePageVisible(true);
    };

    const toggleAskQuestion = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Add Question Unsuccessful Please Sign In")
            return;
        }
        setHomePageVisible(false);
        setAskQuestionPageVisible(true);
        setTagPageVisible(false);
        setAnswerPageVisible(false);
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
        window.location.reload();
    };


    const [numTags, setNumTags] = useState(0);


    useEffect(() => {
        // Define printTags function inside the useEffect
        const printTags = () => {
            // Get the container element
            var container = document.getElementById('tag-container');
            // Iterate through the tags array
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                // Create a new div element for the tag
                const tagElement = document.createElement('div');
                tagElement.classList.add('tag');

                // Create a new anchor element for the tag name
                const tagLink = document.createElement('a');
                tagLink.href = '#'; //can also be button
                tagLink.textContent = tag.name; // Set the text content of the tag link with the tag name

                // Attach click event listener to the tag name link
                (function (tagName) {
                    tagLink.addEventListener('click', function (event) {
                        event.preventDefault(); // Prevent the default action of anchor click

                        // Retrieve all questions associated with the clicked tag name
                        var questionsWithTag = questions.filter(question => {
                            // Check if any of the question's tag IDs match the clicked tag _id
                            return question.tags.some(tagId => {
                                // Find the tag object in the tags array using the tag ID
                                var tag = tags.find(tag => tag._id === tagId);
                                // Check if the tag exists and its name matches
                                return tag && tag.name === tagName;
                            });
                        });
                        setFilteredTag(questionsWithTag)
                        setHomePageVisible(true)
                        setTagPageVisible(false)
                        setAnswerPageVisible(false)
                        setAskQuestionPageVisible(false)
                    });
                })(tag.name);

                // Count the number of questions with the current tag
                let questionCount = 0
                questions.forEach(item => {
                    if (item.tags.includes(tag._id)) {
                        questionCount++;
                    }
                });

                // Create a new div element for the question count
                var questionCountDiv = document.createElement('div');
                questionCountDiv.textContent = `${questionCount} question${questionCount === 1 ? '' : 's'}`;

                // Append the tag link to the tag element
                tagElement.appendChild(tagLink);

                // Append the tag element to the container
                container.appendChild(tagElement);
                tagElement.appendChild(questionCountDiv);

                // Add a line break after every third tag
                if ((i + 1) % 3 === 0) {
                    container.appendChild(document.createElement('br'));
                }
            }
        };

        // Update the number of tags
        setNumTags(tags.length);
        printTags();
    }, [tags, questions, setFilteredTag, setHomePageVisible, setTagPageVisible, setAnswerPageVisible, setAskQuestionPageVisible]);

    return (
        <div id="figure3">
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
                    <button className={"active hyperlinkButton"} onClick={handleTagsClick}>Tags</button>
                </div>
                <div id="main-body-figure3">
                    <p id="num-tags" style={{ marginLeft: '60px', marginTop: '60px' }}>{numTags} {numTags === 1 ? 'tag' : 'tags'}</p>
                    <p id="All-Tags">All Tags</p>
                    <button style={{ float: 'right', marginRight: '60px', marginTop: '-50px' }} className="button1" onClick={toggleAskQuestion}>Ask Questions</button>
                    <br></br>
                    <div id="tag-container" style={{ maxHeight: "73vh", overflow: "auto" }}></div>
                </div>
            </div>
        </div>
    );
};
export default TagPageContent;