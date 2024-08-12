import SearchBar from './searchbar.js';
import { useState } from 'react'
import axios from 'axios';

const AskQuestionContent = ({usernameDisplay, setProfilePage, setWelcomePage, tags, reputation, username, setTags, setQuestions, setFilteredTag, setHomePageVisible, setAskQuestionPageVisible, setTagPageVisible, setAnswerPageVisible, setSearch, setSearchString }) => {
    const [questionTitle, setQuestionTitle] = useState('');
    const [questionText, setQuesitonText] = useState("");
    const [questionTags, setQuesitonTags] = useState('');
    const [questionSummary, setQuestionSummary] = useState('');
    const [error, setError] = useState("");

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

    const handleQuestionsClick = () => {
        setHomePageVisible(true);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setFilteredTag([]);
    };

    const handleTagsClick = () => {
        setHomePageVisible(false);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setTagPageVisible(true);
        setFilteredTag([]);
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
        window.location.reload();
    };
    
    const handleProfilePage = () => {
        setAskQuestionPageVisible(false);
        setProfilePage(true);
    };

    const toggleSearch = (searchString) => {
        setSearchString(searchString);
        setSearch(true);
        setHomePageVisible(true);
        setAnswerPageVisible(false);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setFilteredTag([]);
    };

    const TogglePostQuestion = async (e) => {
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

        let listofnamemymodel = [];
        let newTagIds = []
        let arrayofTags = [...tags];

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
                    const response = await axios.post('http://localhost:8000/addtag', { name, username})
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

        let answers = []

        let email = username;

        try {
            const response = await axios.post('http://localhost:8000/addQuestion', { title, text, newTagIds, answers, usernameDisplay, summary, email})
            const updatedQuestion = response.data;
            setQuestions(updatedQuestion)
        } catch (error) {
            console.error('Error adding question client:', error);
            setError("Error: Cannot Add Question, Not Authorized Please Sign In")
            return
        }

        setHomePageVisible(true)
        setAnswerPageVisible(false)
        setAskQuestionPageVisible(false)
        setTagPageVisible(false)
        setSearch(false)
        setFilteredTag([])
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
            <div style={{ margin: '20px', height: '75vh', maxHeight: '75vh', overflow: 'auto' }}>
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

                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '25%' }}>
                            <p className="error">{error}</p>
                            <button type="button" className="button1post" onClick={TogglePostQuestion}>Post Question</button>
                        </div>
                        <div style={{ width: '75%' }}>
                            <p style={{ margin: '0px', color: 'red', fontFamily: 'Helvetica' }}>*Indicates mandatory fields</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

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

export default AskQuestionContent;