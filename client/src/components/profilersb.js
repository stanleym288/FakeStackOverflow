import { useEffect, useState, useRef } from "react"
import Dateandname from './askbydate.js'
import DisplayUserTags from "./tagpageprofile.js";
import axios from 'axios';

const ProfileRightSideBox = ({ setWelcomePage, setUsers, setAnswers, userClicked, setUserClicked, setUsername, setReputation, setUsernameDisplay, accountId, setAccountId, users, editingTagClicked, setEditingTagClicked, setProfilePage, setQuestions, setTags, questions, setFilteredTag, setHomePageVisible, handleNameClick, createdby, reputation, accountType, username, handlequestiontitleclick }) => {
    // show pages
    useEffect(() => {
        setUserQuestionbutton(accountType === "user");
        setAdminAllUsersButton(accountType === "admin")
    }, [accountType]);

    // for editing tags
    const [clickedTagEdit, setClickedTagEdit] = useState([])
    const [questionTags, setQuesitonTags] = useState('');
    const newTags = (event) => {
        setQuesitonTags(event.target.value);
    }

    const editTag = async (tag) => {
        if (questionTags.length > 20) {
            console.log("long")
            return
        }

        if (questionTags.length === 0) {
            console.log("short")
            return
        }

        const response = await axios.post('http://localhost:8000/edittags', { tag, questionTags })
        setQuestions(response.data.questions)
        setTags(response.data.tags)
        setTagsProfile(response.data.tags)
        setUserTags(response.data.usertags)
        setEditingTagClicked(false)
    }

    const [userQuestionsbutton, setUserQuestionbutton] = useState(false)
    const [adminAllUsersButton, setAdminAllUsersButton] = useState(false)
    const [userAnsweredbutton, setAnsweredButton] = useState(false)
    const [userTagsbutton, setTagsbutton] = useState(false)
    // get values of buttons
    const [userQuestions, setUserQuestions] = useState([]);
    const [userAnswered, setUserAnswered] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [tags, setTagsProfile] = useState([])
    // pagedisplay
    const [answeredCurrentPage, setAnsweredCurrentPage] = useState(0)

    // array manipulation

    let arrayofQuestions = [...userQuestions].sort(function (q1, q2) {
        let q2Date = new Date(q2.asked_date_time)
        let q1Date = new Date(q1.asked_date_time)
        return q2Date - q1Date
    });

    let arrayuserquestionlength = arrayofQuestions.length

    let arrayofAnswered = [...userAnswered]

    // update the set of values
    useEffect(() => {
        axios.get('http://localhost:8000/userquestions', { params: { email: username } })
            .then(res => {
                console.log(res)
                setUserQuestions(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
    }, [username]);

    useEffect(() => {
        axios.get('http://localhost:8000/useranswers', { params: { email: username } })
            .then(res => {
                setUserAnswered(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
    }, [username]);

    useEffect(() => {
        axios.get('http://localhost:8000/usertags', { params: { email: username } })
            .then(res => {
                setUserTags(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
    }, [username]);

    useEffect(() => {
        axios.get('http://localhost:8000/tags')
            .then(res => {
                setTagsProfile(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
    }, []);

    const handleUserClick = async (user) => {
        if (accountId === "") {
            const response = await axios.post('http://localhost:8000/getAdminId', { username })
            console.log("id of the admin", response.data)
            setAccountId(response.data)
        }
        setUsername(user.email)
        setReputation(user.reputation)
        setUsernameDisplay(user.username)
        await axios.get('http://localhost:8000/userquestions', { params: { email: user.email } })
            .then(res => {
                console.log(res)
                setUserQuestions(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
        await axios.get('http://localhost:8000/useranswers', { params: { email: user.email } })
            .then(res => {
                setUserAnswered(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
        await axios.get('http://localhost:8000/usertags', { params: { email: user.email } })
            .then(res => {
                setUserTags(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });

        setUserClicked(true);
    }

    const handleResetToAdmin = async () => {
        if (accountId === "") {
            return
        }
        const response = await axios.post('http://localhost:8000/getAdmin', { accountId })
        setUsername(response.data.email)
        setUsernameDisplay(response.data.name)
        setReputation(response.data.reputation)
        await axios.get('http://localhost:8000/userquestions', { params: { email: response.data.email } })
            .then(res => {
                console.log(res)
                setUserQuestions(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
        await axios.get('http://localhost:8000/useranswers', { params: { email: response.data.email } })
            .then(res => {
                setUserAnswered(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
        await axios.get('http://localhost:8000/usertags', { params: { email: response.data.email } })
            .then(res => {
                setUserTags(res.data)
            }).catch(error => {
                console.error('Error fetching createdBy:', error);
            });
        setUserClicked(false)
    }

    const handleDeleteUser = async (user) => {
        const confirmation = window.confirm("Are you sure you want to delete user?");
        if (confirmation) {
            let adminId = accountId
            if (accountId === "") {
                const response = await axios.post('http://localhost:8000/getAdminId', { username })
                adminId = response.data
            }
            try {
                const response = await axios.post('http://localhost:8000/deleteuser', { user })
                setAnswers(response.data.answers)
                setQuestions(response.data.questions)
                setTags(response.data.tags)
                setUsers(response.data.users)
            } catch (error) {
                alert("Deleting user Error")
            }
            if (user._id === adminId) {
                try {
                    await axios.post('http://localhost:8000/logout')
                  } catch (error) {
                    alert("Sign Out Unsuccessful")
                    return;
                  }
                setProfilePage(false)
                setWelcomePage(true)
            }
        }
    }

    // menu options or toggle through pages

    const toggleuserquestions = () => {
        setAnsweredCurrentPage(0)
        setTagsbutton(false)
        setAnsweredButton(false)
        setAdminAllUsersButton(false);
        setUserQuestionbutton(true)
        setEditingTagClicked(false)
    }

    const toggleansweredquestion = () => {
        setAnsweredCurrentPage(0)
        setUserQuestionbutton(false)
        setTagsbutton(false)
        setAdminAllUsersButton(false);
        setAnsweredButton(true);
        setEditingTagClicked(false)
    }

    const toggleallusers = () => {
        setAnsweredCurrentPage(0)
        setUserQuestionbutton(false)
        setTagsbutton(false)
        setAnsweredButton(false);
        setAdminAllUsersButton(true);
        setEditingTagClicked(false)
    }

    const toggleusertags = () => {
        setAnsweredCurrentPage(0)
        setUserQuestionbutton(false)
        setAnsweredButton(false);
        setAdminAllUsersButton(false);
        setTagsbutton(true)
        setEditingTagClicked(false)
    }

    // add the change pages functionality
    const container = useRef(null);

    const handleResetScroll = () => {
        if (container.current) {
            container.current.scrollTop = 0
        }
    }

    let lengthanswered = arrayofAnswered.length;

    const incrementAnsweredPage = () => {
        let currentpage = answeredCurrentPage + 1;
        if (currentpage > Math.ceil(lengthanswered / 5) - 1) {
            setAnsweredCurrentPage(0);
            return
        }
        setAnsweredCurrentPage(answeredCurrentPage + 1);
    }

    const decrementAnsweredPage = () => {
        if (answeredCurrentPage === 0) {
            return
        }
        setAnsweredCurrentPage(answeredCurrentPage - 1);
    }

    arrayofAnswered = arrayofAnswered.slice(answeredCurrentPage * 5, (answeredCurrentPage * 5) + 5)

    return (
        <>
            {accountType === "user" && <div>
                <div style={{ height: "17%", display: "flex", borderBottom: "solid" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        <Dateandnamemember createdby={createdby} />
                        <p>Reputation: {reputation}</p>
                    </div>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        <button style={{ marginTop: "5%" }} onClick={toggleuserquestions}>user questions</button>
                        <button onClick={toggleansweredquestion}>answered</button>
                        <button onClick={toggleusertags}>user tags</button>
                    </div>
                </div>
                {userQuestionsbutton ? (
                    <div style={{ borderBottom: "dotted" }}><h1 style={{ margin: "3%" }}>User Question Titles:</h1></div>
                ) : null}
                {userAnsweredbutton ? (
                    <div style={{ borderBottom: "dotted" }}><h1 style={{ margin: "3%" }}>User Answered:</h1></div>
                ) : null}
                {userTagsbutton ? (
                    <div style={{ borderBottom: "dotted" }}><h1 style={{ margin: "3%" }}>User Tags:</h1></div>
                ) : null}
                <div ref={container} style={{ height: "45vh", maxHeight: "45vh", overflow: "auto" }}>
                    {userQuestionsbutton ? (
                        <div>
                            {arrayuserquestionlength === 0 ? (
                                <p style={{ margin: "3%" }}>No questions Asked</p>
                            ) : (
                                <div>
                                    {arrayofQuestions.map((item, index) => (
                                        <div key={index}>
                                            <button style={{ margin: "3%" }} className="hyperlinkButton" onClick={() => handlequestiontitleclick(item)}>{item.title}</button>
                                            <br />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                    {userAnsweredbutton ? (
                        <div>
                            {arrayofAnswered.length === 0 ? (
                                <p style={{ margin: "3%" }}>No questions Answered</p>
                            ) : (
                                <div>
                                    {arrayofAnswered.map((item, index) => (
                                        <div className="displayquestionbox" key={index}>
                                            <div style={{ width: '20%', textAlign: 'center' }}>
                                                <p> {item.answers.length} answers</p>
                                                <p> {item.views} views</p>
                                                <p>{item.votes} votes</p>
                                            </div>
                                            <div style={{ width: '50%', overflowWrap: "break-word" }}>
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
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                    {userTagsbutton && !editingTagClicked && (
                        <>
                            {userTags.length === 0 ? (
                                <p style={{ margin: "3%" }}>No User Tags</p>
                            ) : (
                                <DisplayUserTags
                                    tags={userTags}
                                    questions={questions}
                                    setTags={setTags}
                                    setQuestions={setQuestions}
                                    setFilteredTag={setFilteredTag}
                                    setHomePageVisible={setHomePageVisible}
                                    setTagsProfile={setTagsProfile}
                                    setUserTags={setUserTags}
                                    setProfilePage={setProfilePage}
                                    setEditingTagClicked={setEditingTagClicked}
                                    setClickedTagEdit={setClickedTagEdit}
                                />
                            )}
                        </>
                    )}
                    {userTagsbutton && editingTagClicked && (
                        <>
                            <div style={{ margin: "3%" }}>
                                <p style={{ margin: "0px" }}>Type Edited Tag Here:</p>
                                <form>
                                    <input style={{ width: "30%" }} value={questionTags} onChange={newTags}></input>
                                </form>
                                <ErrorTag questionTags={questionTags} />
                                <button onClick={() => editTag(clickedTagEdit)}>Edit Tag</button>
                            </div>
                        </>
                    )}

                </div>
                {userAnsweredbutton && userAnswered.length > 5 && (
                    <div style={{ maxHeight: "5vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ width: "30%", paddingLeft: "230px", height: "30%" }}>
                            <button className="hyperlinkButton" onClick={() => { decrementAnsweredPage(); handleResetScroll(); }}>prev</button>
                        </div>
                        <div style={{ width: "40%", height: "30%" }}>Current Page {answeredCurrentPage + 1}/{Math.ceil(lengthanswered / 5)}</div>
                        <div style={{ width: "30%", height: "30%" }}>
                            <button className="hyperlinkButton" onClick={() => { incrementAnsweredPage(); handleResetScroll(); }}>next</button>
                        </div>
                    </div>
                )}
            </div>}

            {accountType === "admin" && <div>
                <div style={{ height: "17%", display: "flex", borderBottom: "solid" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        <Dateandnamemember createdby={createdby} />
                        <p>Reputation: {reputation}</p>
                    </div>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        <button onClick={toggleallusers}>all users</button>
                        <button style={{ marginTop: "5%" }} onClick={toggleuserquestions}>user questions</button>
                        <button onClick={toggleansweredquestion}>answered</button>
                        <button onClick={toggleusertags}>user tags</button>
                    </div>
                </div>
                {userQuestionsbutton ? (
                    <div style={{ borderBottom: "dotted" }}><h1 style={{ margin: "3%" }}>User Question Titles:</h1></div>
                ) : null}
                {userAnsweredbutton ? (
                    <div style={{ borderBottom: "dotted" }}><h1 style={{ margin: "3%" }}>User Answered:</h1></div>
                ) : null}
                {userTagsbutton ? (
                    <div style={{ borderBottom: "dotted" }}><h1 style={{ margin: "3%" }}>User Tags:</h1></div>
                ) : null}
                {adminAllUsersButton ? (
                    <>
                        <div style={{ borderBottom: "dotted" }}>
                            <h1 style={{ margin: "3%" }}>All Users:</h1>
                        </div>
                    </>
                ) : null}
                {adminAllUsersButton && users.length !== 0 && (
                    <>
                        <button style={{ margin: "1%" }} onClick={handleResetToAdmin}>Reset To Admin Account</button>
                    </>
                )}
                <div ref={container} style={{ height: "45vh", maxHeight: "45vh", overflow: "auto" }}>
                    {userQuestionsbutton ? (
                        <div>
                            {arrayuserquestionlength === 0 ? (
                                <p style={{ margin: "3%" }}>No questions Asked</p>
                            ) : (
                                <div>
                                    {arrayofQuestions.map((item, index) => (
                                        <div key={index}>
                                            <button style={{ margin: "3%" }} className="hyperlinkButton" onClick={() => handlequestiontitleclick(item)}> {item.title}</button>
                                            <br />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                    {userAnsweredbutton ? (
                        <div>
                            {arrayofAnswered.length === 0 ? (
                                <p style={{ margin: "3%" }}>No questions Answered</p>
                            ) : (
                                <div>
                                    {arrayofAnswered.map((item, index) => (
                                        <div className="displayquestionbox" key={index}>
                                            <div style={{ width: '20%', textAlign: 'center' }}>
                                                <p> {item.answers.length} answers</p>
                                                <p> {item.views} views</p>
                                                <p>{item.votes} votes</p>
                                            </div>
                                            <div style={{ width: '50%', overflowWrap: "break-word" }}>
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
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                    {userTagsbutton && !editingTagClicked && (
                        <>
                            {userTags.length === 0 ? (
                                <p style={{ margin: "3%" }}>No User Tags</p>
                            ) : (
                                <DisplayUserTags
                                    tags={userTags}
                                    questions={questions}
                                    setTags={setTags}
                                    setQuestions={setQuestions}
                                    setFilteredTag={setFilteredTag}
                                    setHomePageVisible={setHomePageVisible}
                                    setTagsProfile={setTagsProfile}
                                    setUserTags={setUserTags}
                                    setProfilePage={setProfilePage}
                                    setEditingTagClicked={setEditingTagClicked}
                                    setClickedTagEdit={setClickedTagEdit}
                                />
                            )}
                        </>
                    )}
                    {userTagsbutton && editingTagClicked && (
                        <>
                            <div style={{ margin: "3%" }}>
                                <p style={{ margin: "0px" }}>Type Edited Tag Here:</p>
                                <form>
                                    <input style={{ width: "30%" }} value={questionTags} onChange={newTags}></input>
                                </form>
                                <ErrorTag questionTags={questionTags} />
                                <button onClick={() => editTag(clickedTagEdit)}>Edit Tag</button>
                            </div>
                        </>
                    )}
                    {adminAllUsersButton && (
                        users.map(user => (
                            <div style={{ margin: "3%" }} key={user.username}>
                                - Username: <button className="hyperlinkButton" key={user.username} onClick={() => handleUserClick(user)}> {user.username}</button>, Email: {user.email}
                                {!userClicked && <button style={{ marginLeft: "3%" }} onClick={() => handleDeleteUser(user)}>Delete User</button>}
                            </div>
                        ))
                    )}
                    {adminAllUsersButton && users.length === 0 && (
                        <p>No users in the System</p>
                    )}
                </div>
                {userAnsweredbutton && userAnswered.length > 5 && (
                    <div style={{ maxHeight: "5vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ width: "30%", paddingLeft: "230px", height: "30%" }}>
                            <button className="hyperlinkButton" onClick={() => { decrementAnsweredPage(); handleResetScroll(); }}>prev</button>
                        </div>
                        <div style={{ width: "40%", height: "30%" }}>Current Page {answeredCurrentPage + 1}/{Math.ceil(lengthanswered / 5)}</div>
                        <div style={{ width: "30%", height: "30%" }}>
                            <button className="hyperlinkButton" onClick={() => { incrementAnsweredPage(); handleResetScroll(); }}>next</button>
                        </div>
                    </div>
                )}
            </div>

            }
        </>
    )
}

const ErrorTag = ({ questionTags }) => {
    if (questionTags.length > 20) {
        return <p className="error">Cannot Edit Tag is Too Long</p>;
    }

    if (questionTags.length === 0) {
        return <p className="error">Cannot Edit Tag cannot be empty</p>;
    }

}

const Dateandnamemember = ({ createdby }) => {
    var date = createdby
    var currentDate = new Date();

    if (((currentDate - date) / (1000 * 60 * 60)) < 24) {
        var timeDiffSec = (currentDate - date) / 1000;
        var timeRn = 0;
        if (timeDiffSec < 60) {
            timeRn = Math.floor(timeDiffSec);
            return <p>Been a member for {timeRn} seconds</p>;
        } else if (timeDiffSec < 3600) {
            timeRn = Math.floor(timeDiffSec / 60);
            return <p>Been a member for  {timeRn} minutes</p>;
        } else {
            timeRn = Math.floor(timeDiffSec / 3600);
            return <p>Been a member for  {timeRn} hours</p>;
        }
    } else {
        var yearsDiff = currentDate.getFullYear() - date.getFullYear();
        if (yearsDiff < 1) {
            let timeDiffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
            return <p>Been a member for {timeDiffDays} days</p>;
        } else {
            var yearsDaysDiff = currentDate - new Date(date.getFullYear() + yearsDiff, date.getMonth(), date.getDate());
            let timeDiffDays = Math.floor(yearsDaysDiff / (1000 * 60 * 60 * 24));
            return <p>Been a member for {yearsDiff} years and {timeDiffDays} days</p>;
        }
    }
}

export default ProfileRightSideBox;