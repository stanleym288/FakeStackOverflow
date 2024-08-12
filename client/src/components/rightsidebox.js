import React from 'react';
import Dateandname from './askbydate.js'
import axios from 'axios';
import { useState , useRef} from 'react';

const RightSideBox = ({ setAskQuestionPageVisible, setHomePageVisible, setAnswerPageVisible, setTagPageVisible, questions, setQuestions, answers, tags, newest, active, unanswered, setnewest, setactive, setunanswered, searchOn, searchString, setSearch, setCurrentQuestionClicked, filteredTag }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const container = useRef(null);

    const handleResetPage = () => {
        setCurrentPage(0)
    }

    const handleResetScroll = () => {
        if (container.current) {
            container.current.scrollTop = 0
        }
    }

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        try {
          await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
          alert("Add Question Unsuccessful Please Sign In")
          return;
        }
        setHomePageVisible(false)
        setAskQuestionPageVisible(true)
        setTagPageVisible(false)
        setAnswerPageVisible(false)
        setSearch(false)
    }

    const handleNameClick = async (itemTitle) => {
        let questionId = itemTitle
        try {
            const updatedQuestionViews = await axios.put(`http://localhost:8000/questions/${questionId}/incviews`, { questionId });
            setQuestions(updatedQuestionViews.data)
            console.log("this is the response from increasing views:", updatedQuestionViews.data)
        } catch (error) {
            alert("Title Click Unsuccessful")
            return
        }
        setCurrentQuestionClicked(itemTitle);
        setHomePageVisible(false);
        setAnswerPageVisible(true);
        setAskQuestionPageVisible(false);
        setTagPageVisible(false);
        setSearch(false);
    };

    let arrayofQuestions = [...questions].sort(function (q1, q2) {
        let q2Date = new Date(q2.asked_date_time)
        let q1Date = new Date(q1.asked_date_time)
        return q2Date - q1Date
    });
    let arrayofAnswers;
    let arrayofTags = [...tags];

    if (newest === true) {
        arrayofQuestions = [...questions].sort(function (q1, q2) {
            let q2Date = new Date(q2.asked_date_time)
            let q1Date = new Date(q1.asked_date_time)
            return q2Date - q1Date
        })
    } else if (active === true) {
        var activeQuestion = [];
        arrayofAnswers = [...answers].sort(function (a1, a2) {
            let a2Date = new Date(a2.ans_date_time)
            let a1Date = new Date(a1.ans_date_time)
            return a2Date - a1Date
        })

        for (let i = 0; i < arrayofAnswers.length; i++) {
            var AID = arrayofAnswers[i]._id;
            for (var j = 0; j < arrayofQuestions.length; j++) {
                if (arrayofQuestions[j].answers.includes(AID)) {
                    if (activeQuestion.includes(arrayofQuestions[j]) === false) {
                        activeQuestion.push(arrayofQuestions[j])
                    }
                }
            }
        }

        for (let i = 0; i < arrayofQuestions.length; i++) {
            if (arrayofQuestions[i].answers.length === 0) {
                activeQuestion.push(arrayofQuestions[i])
            }
        }
        arrayofQuestions = activeQuestion;
    } else if (unanswered === true) {
        var unansweredQuestion = [];
        for (let i = 0; i < arrayofQuestions.length; i++) {
            if (arrayofQuestions[i].answers.length === 0) {
                unansweredQuestion.push(arrayofQuestions[i])
            }
        }
        arrayofQuestions = unansweredQuestion
    }

    if (searchOn === true) {
        var newQuestionarray = []; // this is where we are going to store our questions
        var searchedresultsarray = []; // this is where all the search values are going to be located
        var searchinput = searchString.toLowerCase();
        searchedresultsarray = searchinput.split(" ");

        for (let i = 0; i < searchedresultsarray.length; i++) {
            if (searchedresultsarray[i] === "") {
                continue;
            }
            if ((searchedresultsarray[i]).charAt(0) === '[' && (searchedresultsarray[i]).charAt(searchedresultsarray[i].length - 1) === ']') {
                var searchedTag = searchedresultsarray[i].substring(1, searchedresultsarray[i].length - 1);

                for (let j = 0; j < arrayofTags.length; j++) {
                    if ((arrayofTags[j].name).toLowerCase() === searchedTag) { // tag is found from search

                        var tagid = arrayofTags[j]._id;

                        for (let k = 0; k < arrayofQuestions.length; k++) { // find where the tag is in question

                            if (arrayofQuestions[k].tags.includes(tagid)) { // tag is found in question
                                if (newQuestionarray.includes(arrayofQuestions[k]) === false) {
                                    newQuestionarray.push(arrayofQuestions[k]);
                                }
                            }

                        }
                    }
                }
            } else { // other wise it is part of the title

                var searchTitleWord = searchedresultsarray[i]

                for (let j = 0; j < arrayofQuestions.length; j++) {
                    var eachWordSentence = arrayofQuestions[j].title.split(/[\W_]+/);   // split the title into indiviual words

                    for (let k = 0; k < eachWordSentence.length; k++) {
                        if (eachWordSentence[k].toLowerCase() === searchTitleWord) { // if a word in the title matches the searched word
                            if (newQuestionarray.includes(arrayofQuestions[j]) === false) {
                                newQuestionarray.push(arrayofQuestions[j]);
                            }
                        }
                    }

                    var eachWordText = arrayofQuestions[j].text.split(/[\W_]+/);

                    for (let k = 0; k < eachWordText.length; k++) {
                        if (eachWordText[k].toLowerCase() === searchTitleWord) { // if a word in the text matches the searched word
                            if (newQuestionarray.includes(arrayofQuestions[j]) === false) {
                                newQuestionarray.push(arrayofQuestions[j]);
                            }
                        }
                    }

                }
            }
        }

        arrayofQuestions = newQuestionarray
        arrayofQuestions.sort(function (q1, q2) {
            let q2Date = new Date(q2.asked_date_time)
            let q1Date = new Date(q1.asked_date_time)
            return q2Date - q1Date
        });

        if (active === true) {
            var activeQuestion1 = [];
            arrayofAnswers = [...answers].sort(function (a1, a2) {
                let a2Date = new Date(a2.ans_date_time)
                let a1Date = new Date(a1.ans_date_time)
                return a2Date - a1Date
            })
    
            for (let i = 0; i < arrayofAnswers.length; i++) {
                var AID1 = arrayofAnswers[i]._id;
                for (var k = 0; k < arrayofQuestions.length; k++) {
                    if (arrayofQuestions[k].answers.includes(AID1)) {
                        if (activeQuestion1.includes(arrayofQuestions[k]) === false) {
                            activeQuestion1.push(arrayofQuestions[k])
                        }
                    }
                }
            }
            AID = AID1
    
            for (let i = 0; i < arrayofQuestions.length; i++) {
                if (arrayofQuestions[i].answers.length === 0) {
                    activeQuestion1.push(arrayofQuestions[i])
                }
            }
            arrayofQuestions = activeQuestion1;
        }
        activeQuestion = activeQuestion1
    }

    if (filteredTag.length !== 0) {
        arrayofQuestions = filteredTag;
        arrayofQuestions.sort(function (q1, q2) {
            let q2Date = new Date(q2.asked_date_time)
            let q1Date = new Date(q1.asked_date_time)
            return q2Date - q1Date
        })
    }

    let length = arrayofQuestions.length;

    const incrementPage = () => {
        let currentpage = currentPage + 1;
        if (currentpage > Math.ceil(length/5) - 1) {
            setCurrentPage(0);
            return
        }
        setCurrentPage(currentPage + 1);
    }

    const decrementPage = () => {
        if (currentPage === 0) {
            return
        }
        setCurrentPage(currentPage - 1);
    }

    arrayofQuestions = arrayofQuestions.slice(currentPage * 5, (currentPage * 5) + 5)

    return (
        <>
            <div className="question-header">
                <div style={{ width: '50%' }}>
                    {searchOn === true ? (
                        <h1 style={{ marginLeft: '10px' }}> Search Results </h1>
                    ) : (
                        <h1 style={{ marginLeft: '10px' }}> All Questions </h1>
                    )}
                    <p style={{ marginLeft: '10px' }}> {length} questions </p>
                </div>
                <div style={{ width: '50%' }}>
                    <button style={{ float: 'right', margin: '40px' }} className="button1" onClick={handleAskQuestion}>Ask Questions</button>
                    <div style={{ float: 'right', display: 'table', marginTop: '100px' }}>
                        <button className='button2' onClick={() => {setnewest(); handleResetPage();}}>Newest</button>
                        <button className='button2' onClick={() => {setactive(); handleResetPage();}}>Active</button>
                        <button className='button2' onClick={() => {setunanswered(); handleResetPage();}}>Unanswered</button>
                    </div>
                </div>
            </div>
            <div ref={container} style={{height: '55vh', maxHeight: '55vh', overflow: 'auto' }}>
                {length === 0 ? (
                    searchOn === false ? 
                    (<h1 style={{ margin: '50px' }}> No Questions Found</h1>) 
                    : 
                    (<h1 style={{ margin: '50px' }}> no results found</h1>)
                ) : (arrayofQuestions.map((item, index) => (
                    <div className="displayquestionbox" key={index}>
                        <div style={{ width: '20%', textAlign: 'center' }}>
                            <p> {item.answers.length} answers</p>
                            <p> {item.views} views</p>
                            <p>{item.votes} votes</p>
                        </div>
                        <div style={{ width: '50%', overflowWrap: "break-word"}}>
                            <button className="hyperlinkButton" style={{ marginTop: '20px' }} onClick={() => handleNameClick(item._id)}>{item.title}</button>
                            <p>{item.summary}</p>
                            <p>
                                {tags.map((tag, index) => (
                                    item.tags.includes(tag._id) ? (
                                        <span key={index} style={{ backgroundColor: 'grey', borderRadius: '5px', display: 'inline-block', margin: '5px', padding: '5px 10px', color: 'white' }}>
                                            {tag.name}
                                        </span>
                                    ) : null
                                ))}
                            </p>
                        </div>
                        <div style={{ width: '30%', textAlign: 'center' }}>
                            <Dateandname item={item} />
                        </div>
                    </div>
                ))
                )}
            </div>
            {length > 5 ? (
                <div style={{ maxHeight: "5vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "30%", paddingLeft: "230px", height: "30%" }}>
                        <button className="hyperlinkButton" onClick={() => { decrementPage(); handleResetScroll(); }}>prev</button>
                    </div>
                    <div style={{ width: "40%", height: "30%" }}>Current Page {currentPage + 1}/{Math.ceil(length / 5)}</div>
                    <div style={{ width: "30%", height: "30%" }}>
                        <button className="hyperlinkButton" onClick={() => { incrementPage(); handleResetScroll(); }}>next</button>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default RightSideBox;
