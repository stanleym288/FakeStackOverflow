import Dateandname from "./askbydate";
import React from "react";
import { useState, useRef, useEffect } from 'react';
import axios from "axios";

const AnswerDisplayQuestion = ({ setReputation, handleEditAnswer, clickedFromAnswered, setClickedFromAnswered, usernameDisplay, tags, username, reputation, questions, answers, setQuestions, setAnswers, currentQuestionClicked, handleAnsQuestion, handleAskQuestion }) => {
    // get all comments
    const [comments, setComments] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/comments')
            .then(res => {
                setComments(res.data)
                console.log("comments", res.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const updateReputation = () => {
        axios.get('http://localhost:8000/reputation', { params: { email: username } })
          .then(res => {
            setReputation(res.data.reputation)
          }).catch(error => {
            console.error('Error fetching data:', error);
          });
    }

    // state for page stuff
    const [currentPage, setCurrentPage] = useState(0);
    const container = useRef(null);

    const [currentQuestionCommentPage, setQuestionCommentPage] = useState(0);

    const handleResetScroll = () => {
        if (container.current) {
            container.current.scrollTop = 0
        }
    }

    const [currentQuestionComment, setCurrentQuestionComment] = useState("")

    let arrayofQuestions = [...questions].sort(function (q1, q2) {
        let q2Date = new Date(q2.asked_date_time)
        let q1Date = new Date(q1.asked_date_time)
        return q2Date - q1Date
    });
    let arrayofAnswers = [...answers];
    let arrayofComments = [...comments].sort(function (q1, q2) {
        let q2Date = new Date(q2.com_date_time)
        let q1Date = new Date(q1.com_date_time)
        return q2Date - q1Date
    });;


    // obtain the question
    var indexQuestion = 0;
    for (let i = 0; i < arrayofQuestions.length; i++) {
        if (arrayofQuestions[i]._id === currentQuestionClicked) {
            indexQuestion = i;
            break;
        }
    }

    // obtainlistcomments
    let commentId = arrayofQuestions[indexQuestion].comments

    let commentIdSorted = arrayofComments.filter(obj => commentId.includes(obj._id));

    // update the number of views
    let updatedViews = (arrayofQuestions[indexQuestion].views);

    // obtain the question title

    let title = (arrayofQuestions[indexQuestion].title);

    // obtain the number of answers
    let numberAnswers = arrayofQuestions[indexQuestion].answers.length

    // obtain the number of votes

    let numberVotes = arrayofQuestions[indexQuestion].votes

    // obtain the number of comments in a question

    let numberComments = arrayofQuestions[indexQuestion].comments.length

    // obtain the current text
    let questionText = arrayofQuestions[indexQuestion].text

    // obtain the answerid for that question
    let answerId = arrayofQuestions[indexQuestion].answers

    let sortedAnswers = arrayofAnswers.sort(function (a1, a2) {
        let a2Date = new Date(a2.ans_date_time)
        let a1Date = new Date(a1.ans_date_time)
        return a2Date - a1Date
    });

    let answerIdSorted = sortedAnswers.filter(obj => answerId.includes(obj._id));

    let length = answerIdSorted.length

    const incrementPage = () => {
        let currentpage = currentPage + 1;

        if (currentpage > Math.ceil(length / 5) - 1) {
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


    const incrementQuestionCommentPage = () => {
        let currentpage = currentQuestionCommentPage + 1;

        if (numberComments === 0) {
            return
        }

        if (currentpage > Math.ceil(numberComments / 3) - 1) {
            setQuestionCommentPage(0);
            return
        }
        setQuestionCommentPage(currentQuestionCommentPage + 1);
    }

    const decrementQuestionCommentPage = () => {
        if (currentQuestionCommentPage === 0) {
            return
        }
        setQuestionCommentPage(currentQuestionCommentPage - 1);
    }

    const handleQuestionDownvote = async (e) => {
        e.preventDefault();
        updateReputation();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Downvote Question Unsuccessful Please Sign In")
            setCurrentQuestionComment('')
            return;
        }

        if (reputation < 50) {
            alert("You need at least 50 reputation to vote");
            setCurrentQuestionComment('')
            return;
        }

        try {
            const email = arrayofQuestions[indexQuestion].email
            const questionId = arrayofQuestions[indexQuestion]._id
            const updatedVotes = await axios.post("http://localhost:8000/downvote", { email: email, questionId: questionId });
            setQuestions(updatedVotes.data);
        } catch (error) {
            console.error('Error downvoting reputation:', error.message);
        }
    };

    const handleQuestionUpvote = async (e) => {
        e.preventDefault();
        updateReputation();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Upvote Question Unsuccessful Please Sign In")
            setCurrentQuestionComment('')
            return;
        }

        if (reputation < 50) {
            alert("You need at least 50 reputation to vote");
            setCurrentQuestionComment('')
            return;
        }

        try {
            const email = arrayofQuestions[indexQuestion].email
            const questionId = arrayofQuestions[indexQuestion]._id
            const updatedVotes = await axios.post("http://localhost:8000/upvote", { email: email, questionId: questionId });
            setQuestions(updatedVotes.data);
        } catch (error) {
            console.error('Error upvoting reputation:', error.message);
        }
    };


    const handleAddQuestionComment = async (e) => {
        e.preventDefault();
        updateReputation();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Add Question Comment Unsuccessful Please Sign In")
            setCurrentQuestionComment('')
            return;
        }

        if (reputation < 50) {
            alert("You need at least 50 reputation to comment");
            setCurrentQuestionComment('')
            return;
        }

        if (currentQuestionComment.length > 140 || currentQuestionComment.length === 0) {
            alert("Invalid comment length please try again.");
            setCurrentQuestionComment('')
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/addcommentquestion', { currentQuestionComment, usernameDisplay, username })
            let comment = response.data.comment
            let commentarray = response.data.comments
            let questionId = currentQuestionClicked
            setComments(commentarray)
            const updateQuestion = await axios.put('http://localhost:8000/question/updatecomments', { questionId, comment })
            setQuestions(updateQuestion.data)
            setCurrentQuestionComment('')
        } catch (error) {
            console.error('Error adding answer client:', error);
        }
    }

    const newQuestionComment = (event) => {
        setCurrentQuestionComment(event.target.value)
    }

    const handleDeleteAnswer = async (answerId) => {
        let questionId = currentQuestionClicked
        const response = await axios.post('http://localhost:8000/deleteanswer', { questionId, answerId })
        setAnswers(response.data.answers)
        setQuestions(response.data.questions)
    }

    if (clickedFromAnswered === true) {
        let questionAnsweredFromUser = []
        let restOfAnswers = []

        for (const answer of answerIdSorted) {
            if (answer.email === username) {
                questionAnsweredFromUser.push(answer)
            } else {
                restOfAnswers.push(answer)
            }
        }
        answerIdSorted = questionAnsweredFromUser.concat(restOfAnswers)
        answerIdSorted = answerIdSorted.slice(currentPage * 5, (currentPage * 5) + 5)
    } else {
        answerIdSorted = answerIdSorted.slice(currentPage * 5, (currentPage * 5) + 5)
    }

    console.log("length of answer id sorted", answerIdSorted.length)
    commentIdSorted = commentIdSorted.slice(currentQuestionCommentPage * 3, (currentQuestionCommentPage * 3) + 3)

    return (
        <>
            <div className="answerheader">
                <div style={{ width: '8%', display: 'flex', flexDirection: 'column', marginTop: "5%" }}>
                    <button style={{ marginLeft: "5%" }} onClick={handleQuestionUpvote}>Upvote</button>
                    <button style={{ marginLeft: "5%" }} onClick={handleQuestionDownvote}>Downvote</button>
                </div>
                <div style={{ width: '20%', textAlign: 'center' }}>
                    <p style={{ paddingTop: '5px' }}>{numberAnswers} answers</p>
                    <p style={{ paddingTop: '5px' }}>{updatedViews} views</p>
                    <p style={{ paddingTop: '5px' }}>{numberVotes} votes</p>
                    <p style={{ paddingTop: '5px' }}>{numberComments} comments</p>

                </div>
                <div style={{ width: '55%', maxHeight: "100%", overflow: "auto" }}>
                    <p style={{ paddingTop: '10px', fontWeight: 'bold' }}>{title}</p>
                    <p style={{ paddingTop: '10px', marginRight: '100px' }}><TextHyperlinks text={questionText} /></p>
                    <p>
                        {tags.map((tag, index) => (
                            arrayofQuestions[indexQuestion].tags.includes(tag._id) ? (
                                <span key={index} style={{ backgroundColor: 'grey', borderRadius: '5px', display: 'inline-block', margin: '5px', padding: '5px 10px', color: 'white' }}>
                                    {tag.name}
                                </span>
                            ) : null
                        ))}
                    </p>
                </div>
                <div>
                    <button style={{ float: 'right', margin: '30px' }} className="button1" onClick={handleAskQuestion}>Ask Questions</button>
                    <div style={{ paddingTop: '90px', paddingLeft: '40px' }}>
                        <Dateandname item={arrayofQuestions[indexQuestion]} />
                    </div>
                </div>
            </div>
            {numberComments !== 0 ? (
                <div style={{ height: '15vh', maxHeight: '15vh', display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "70%", maxHeight: '70%', overflow: "auto" }}>
                        {commentIdSorted.map((item, index) => (
                            <div className="displaycommentbox" key={index}>
                                <Displaycomments item={item} setComments={setComments} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", textAlign: 'center' }}>
                        <div style={{ paddingLeft: "170px", width: "20%", height: "50%" }}><button className="hyperlinkButton" onClick={() => { decrementQuestionCommentPage(); }}>prev</button></div>
                        <div style={{ width: "20%", height: "50%" }}>Current Page {currentQuestionCommentPage + 1}/{numberComments === 0 ? 1 : Math.ceil(numberComments / 3)}</div>
                        <div style={{ width: "20%", height: "50%" }}><button className="hyperlinkButton" onClick={() => { incrementQuestionCommentPage(); }}>next</button></div>
                    </div>
                </div>
            ) : null}
            <div style={{ height: '6vh', display: "flex", borderBottom: "dotted" }}>
                <div style={{ width: "30%" }}>
                    <textarea style={{ width: "80%", height: '5vh' }} value={currentQuestionComment} onChange={newQuestionComment}></textarea>
                </div>
                <div>
                    <button style={{ marginTop: '15%' }} onClick={handleAddQuestionComment}>add comment</button>
                </div>
            </div>
            <div style={{ borderBottom: "3px dotted", textAlign: "center", fontWeight: "bold"}}>ANSWERS:</div>
            <div ref={container} style={{ height: '27vh', maxHeight: '27vh', overflow: "auto" }}>
                {answerIdSorted.map((item, index) => (
                    <div key={index}>
                        <div className="displayquestionboxanswers">
                            <Displayanswers
                                item={item}
                                setAnswers={setAnswers}
                                reputation={reputation}
                                clickedFromAnswered={clickedFromAnswered}
                                handleEditAnswer={handleEditAnswer}
                                username={username}
                                handleDeleteAnswer={handleDeleteAnswer}
                                updateReputation={updateReputation}
                            />
                        </div>
                        <div style={{ borderTop: "solid" }}>
                            <p style={{ marginLeft: '5%' }}>{item.comments.length} comments</p>
                        </div>
                        <Displayanswercomments
                            item={item}
                            answerId={item._id}
                            arrayofComments={arrayofComments}
                            currentQuestionClicked={currentQuestionClicked}
                            setComments={setComments} ƒ
                            setAnswers={setAnswers}
                            usernameDisplay={usernameDisplay}
                            reputation={reputation}
                            username={username}
                            updateReputation={updateReputation}
                        />
                    </div>
                ))}
            </div>
            {answerIdSorted.length === 0 ? (
                <div style={{ display: "flex" }}>
                    <div style={{ width: '25%' }}><button className="button1answer" onClick={handleAnsQuestion}>Answer Question</button></div>
                </div>
            ) : (
                <div style={{ display: "flex" }}>
                    <div style={{ width: '25%' }}><button className="button1answer" onClick={handleAnsQuestion}>Answer Question</button></div>
                    <div style={{ width: "20%", height: "50%" }}><button className="hyperlinkButton" onClick={() => { decrementPage(); handleResetScroll(); }}>prev</button></div>
                    <div style={{ width: "25%", height: "50%" }}>Current Page {currentPage + 1}/{length === 0 ? 1 : Math.ceil(length / 5)}</div>
                    <div style={{ width: "25%", height: "50%" }}><button className="hyperlinkButton" f onClick={() => { incrementPage(); handleResetScroll(); }}>next</button></div>
                </div>
            )}
        </>
    )
}

const Displayanswers = ({ handleDeleteAnswer, handleEditAnswer, item, setAnswers, reputation, clickedFromAnswered, username, updateReputation}) => {
    const handleAnswerUpvote = async (e) => {
        e.preventDefault();
        updateReputation();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Upvote Answer Unsuccessful Please Sign In")
            return;
        }

        if (reputation < 50) {
            alert("You need at least 50 reputation to vote");
            return;
        }

        try {
            const email = item.email
            const answerId = item._id
            const updatedVotes = await axios.post("http://localhost:8000/upvoteanswer", { email: email, answerId: answerId });
            setAnswers(updatedVotes.data);
        } catch (error) {
            console.error('Error upvoting reputation:', error.message);
        }
    };

    const handleAnswersDownvote = async (e) => {
        e.preventDefault();
        updateReputation();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Downvote Answer Unsuccessful Please Sign In")
            return;
        }

        if (reputation < 50) {
            alert("You need at least 50 reputation to vote");
            return;
        }

        try {
            const email = item.email
            const answerId = item._id
            const updatedVotes = await axios.post("http://localhost:8000/downvoteanswer", { email: email, answerId: answerId });
            setAnswers(updatedVotes.data);
        } catch (error) {
            console.error('Error downvoting reputation:', error.message);
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center', margin: "1%", width: "8%", display: 'flex', flexDirection: 'column' }}>
                <button onClick={handleAnswerUpvote}>Upvote</button>
                <p style={{ margin: "0px" }}>{item.votes}</p>
                <button onClick={handleAnswersDownvote}>Downvote</button>
            </div>
            <div style={{ width: '52%', marginLeft: '10px' }}>
                <p><TextHyperlinks text={item.text} /></p>
            </div>
            <div style={{ width: '30%' }}>
                <p style={{ color: 'green', marginLeft: '177px', marginBottom: '0px' }}>{item.ans_by}</p>
                <Dateandnameanswer item={item} />
            </div>
            <DisplayEditDelete
                item={item}
                handleEditAnswer={handleEditAnswer}
                clickedFromAnswered={clickedFromAnswered}
                username={username}
                handleDeleteAnswer={handleDeleteAnswer}
            />
        </>
    )
}

const DisplayEditDelete = ({ handleDeleteAnswer, item, handleEditAnswer, clickedFromAnswered, username }) => {
    let isUserAnswered = false;
    if ((item.email === username) && clickedFromAnswered) {
        console.log("match is found")
        isUserAnswered = true
    }
    console.log("is user answered", isUserAnswered)
    return (
        <>
            {isUserAnswered && (<div style={{ width: '10%', textAlign: "center" }}>
                <button style={{ marginTop: "30%" }} onClick={() => handleEditAnswer(item)}>Edit</button>
                <button onClick={() => handleDeleteAnswer(item._id)}>Delete</button>
            </div>)}
        </>
    )

}

const Displaycomments = ({ item, setComments }) => {
    const handleCommentUpvote = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Upvote Answer Unsuccessful Please Sign In")
            return;
        }

        try {
            const commentId = item._id
            const updatedVotes = await axios.post("http://localhost:8000/upvotecomment", { commentId: commentId });
            setComments(updatedVotes.data);
        } catch (error) {
            console.error('Error upvoting reputation:', error.message);
        }
    };

    return (
        <>
            <button onClick={handleCommentUpvote}>Upvote</button>
            <p style={{ margin: '3px' }}>{item.votes} {item.text} - {item.com_by} <span><Dateandnamecomment item={item} /></span></p>
        </>
    )

}

const Displayanswercomments = ({ item, answerId, arrayofComments, setComments, setAnswers, usernameDisplay, reputation, username, updateReputation}) => {
    const [currentQuestionComment, setCurrentQuestionComment] = useState("");
    const [currentQuestionCommentPage, setQuestionCommentPage] = useState(0);
    let numberComments = item.comments.length
    let commentId = item.comments
    let commentIdSorted = arrayofComments.filter(obj => commentId.includes(obj._id));
    commentIdSorted = commentIdSorted.slice(currentQuestionCommentPage * 3, (currentQuestionCommentPage * 3) + 3)

    const newQuestionComment = (event) => {
        setCurrentQuestionComment(event.target.value)
    }

    const incrementQuestionCommentPage = () => {
        let currentpage = currentQuestionCommentPage + 1;

        if (numberComments === 0) {
            return
        }

        if (currentpage > Math.ceil(numberComments / 3) - 1) {
            setQuestionCommentPage(0);
            return
        }
        setQuestionCommentPage(currentQuestionCommentPage + 1);
    }

    const decrementQuestionCommentPage = () => {
        if (currentQuestionCommentPage === 0) {
            return
        }
        setQuestionCommentPage(currentQuestionCommentPage - 1);
    }



    const handleAddQuestionComment = async (e) => {
        e.preventDefault();
        updateReputation();
        try {
            await axios.post('http://localhost:8000/addquestionclick')
        } catch (error) {
            alert("Add Answer Comment Unsuccessful Please Sign In")
            setCurrentQuestionComment('')
            return;
        }

        if (reputation < 50) {
            alert("You need at least 50 reputation to comment");
            setCurrentQuestionComment('')
            return;
        }

        if (currentQuestionComment.length > 140 || currentQuestionComment.length === 0) {
            alert("Invalid comment length please try again.");
            setCurrentQuestionComment('')
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/addcommentquestion', { currentQuestionComment, usernameDisplay, username})
            let comment = response.data.comment
            let commentarray = response.data.comments
            setComments(commentarray)
            const updateanswers = await axios.put('http://localhost:8000/answer/updatecomments', { answerId, comment })
            setAnswers(updateanswers.data)
            setCurrentQuestionComment('')
        } catch (error) {
            console.error('Error adding answer client:', error);
        }
    }

    return (
        <>
            {(commentIdSorted).map((comment, indexcomment) => (
                <div className="displaycommentbox" key={indexcomment}>
                    <Displaycomments item={comment} setComments={setComments} />
                </div>
            ))}
            {numberComments !== 0 ? (<div style={{ display: "flex", textAlign: 'center' }}>
                <div style={{ paddingLeft: "170px", width: "20%", height: "50%" }}><button className="hyperlinkButton" onClick={() => { decrementQuestionCommentPage(); }}>prev</button></div>
                <div style={{ width: "20%", height: "50%" }}>Current Page {currentQuestionCommentPage + 1}/{numberComments === 0 ? 1 : Math.ceil(numberComments / 3)}</div>
                <div style={{ width: "20%", height: "50%" }}><button className="hyperlinkButton" onClick={() => { incrementQuestionCommentPage(); }}>next</button></div>
            </div>) : null}
            <div style={{ display: 'flex', borderBottom: "dotted" }}>
                <div style={{ width: "30%" }}>
                    <textarea style={{ width: "80%", height: '5vh' }} value={currentQuestionComment} onChange={newQuestionComment}></textarea>
                </div>
                <div>
                    <button style={{ marginTop: '15%' }} onClick={handleAddQuestionComment}>add comment</button>
                </div>
            </div>
        </>
    );
}

const Dateandnameanswer = ({ item }) => {
    var date = new Date(item.ans_date_time)
    var currentDate = new Date();

    if (((currentDate - date) / (1000 * 60 * 60)) < 24) {
        var timeDiffSec = (currentDate - date) / 1000;
        var timeRn = 0
        if (timeDiffSec < 60) {
            timeRn = Math.floor(timeDiffSec)
            return <p style={{ marginLeft: '175px', marginTop: '0px' }}>answered {timeRn} seconds ago</p>
        } else if (timeDiffSec < 3600) {
            timeRn = Math.floor(timeDiffSec / 60)
            return <p style={{ marginLeft: '175px', marginTop: '0px' }}>answered {timeRn} minutes ago</p>
        } else {
            timeRn = Math.floor(timeDiffSec / 3600)
            return <p style={{ marginLeft: '175px', marginTop: '0px' }}>answered {timeRn} hours ago</p>
        }
    } else if (date.getFullYear() === currentDate.getFullYear()) {
        let month = date.toLocaleDateString('en-US', { month: 'short' });
        let day = date.getDate()
        let hours = String(date.getHours()).padStart(2, '0');
        let mins = String(date.getMinutes()).padStart(2, '0');
        return <p style={{ marginLeft: '175px', marginTop: '0px' }}>answered {month} {day} at {hours}:{mins}</p>
    } else {
        let month = date.toLocaleDateString('en-US', { month: 'short' });
        let day = date.getDate()
        let year = date.getFullYear()
        let hours = String(date.getHours()).padStart(2, '0');
        let mins = String(date.getMinutes()).padStart(2, '0');
        return <p style={{ marginLeft: '175px', marginTop: '0px' }}>answered {month} {day},  {year} at {hours}:{mins}</p>
    }

}

const Dateandnamecomment = ({ item }) => {
    var date = new Date(item.com_date_time)
    var currentDate = new Date();

    if (((currentDate - date) / (1000 * 60 * 60)) < 24) {
        var timeDiffSec = (currentDate - date) / 1000;
        var timeRn = 0
        if (timeDiffSec < 60) {
            timeRn = Math.floor(timeDiffSec)
            return <span>commented {timeRn} seconds ago</span>
        } else if (timeDiffSec < 3600) {
            timeRn = Math.floor(timeDiffSec / 60)
            return <span>commented  {timeRn} minutes ago</span>
        } else {
            timeRn = Math.floor(timeDiffSec / 3600)
            return <span>commented  {timeRn} hours ago</span>
        }
    } else if (date.getFullYear() === currentDate.getFullYear()) {
        let month = date.toLocaleDateString('en-US', { month: 'short' });
        let day = date.getDate()
        let hours = String(date.getHours()).padStart(2, '0');
        let mins = String(date.getMinutes()).padStart(2, '0');
        return <span>commented  {month} {day} at {hours}:{mins}</span>
    } else {
        let month = date.toLocaleDateString('en-US', { month: 'short' });
        let day = date.getDate()
        let year = date.getFullYear()
        let hours = String(date.getHours()).padStart(2, '0');
        let mins = String(date.getMinutes()).padStart(2, '0');
        return <span>commented  {month} {day},  {year} at {hours}:{mins}</span>
    }
}

const TextHyperlinks = ({ text }) => {
    let splitlinks = text.split(/(\[.*?\]\(.*?\))/g);
    const newTextlinks = splitlinks.map((part, index) => {
        let link = part.match(/\[(.*?)\]\((.*?)\)/);
        if (link) {
            let bracketText = link[1];
            let parentesesText = link[2];

            if (bracketText.length === 0) {
                return <a key={index} href={parentesesText} target="_blank" rel="noreferrer">{parentesesText}</a>
            } else {
                return <a key={index} href={parentesesText} target="_blank" rel="noreferrer">{bracketText}</a>
            }
        } else {
            return part
        }
    });
    return newTextlinks
}

export default AnswerDisplayQuestion;