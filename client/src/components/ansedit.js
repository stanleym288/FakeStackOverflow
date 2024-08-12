import React from "react";
import { useState } from 'react';
import axios from 'axios';

const EditAnswer = ({setEditQuesitonClick, currentAnswerClicked, setAnswers}) => {
    const [answerText, setAnswerText] = useState(currentAnswerClicked.text);

    const newAnswerText = (event) => {
        setAnswerText(event.target.value);
    }

    const toggleAnswerQuestion = async () => {
        let text = answerText.toLowerCase();
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

        let answerId = currentAnswerClicked._id

        try {
            // edit answer
            const response = await axios.post('http://localhost:8000/updateanswer', {text, answerId})
            setAnswers(response.data)
        } catch (error) {
            console.error('Error adding answer client:', error);
            return
        }
        setEditQuesitonClick(false)
    }

    return (
        <>
            <form>
                <h1 style={{ fontSize: '25px', marginLeft: '70px', marginBottom: '0px', marginTop: '50px' }}> Edit Answer Text* </h1>
                <textarea style={{ fontFamily: 'Times New Roman, Times, serif', marginLeft: '50px', width: '600px', height: '350px' }} value={answerText} onChange={newAnswerText}></textarea>
                <ErrorText questionText={answerText} />
                <br />
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '30%' }}> <button type="button" className="button1post" onClick={toggleAnswerQuestion}>Update Answer</button> </div>
                    <div style={{ width: '50%' }}>
                        <p style={{ margin: '0px', marginTop: '10px', color: 'red', fontFamily: 'Helvetica' }}>*Indicates mandatory fields</p>
                    </div>
                </div>
            </form>
        </>
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


export default EditAnswer