import axios from "axios";
import { useState, useEffect, useCallback } from "react";

const DisplayUserTags = ({ setClickedTagEdit, setEditingTagClicked, setProfilePage, setUserTags, setTagsProfile, setTags, setQuestions, tags, questions, setFilteredTag, setHomePageVisible }) => {
    const [numTags, setNumTags] = useState(0);

    const handleEditTag = useCallback(async (tag) => {
        if (tag.emails.length > 1) {
            return alert("Editing Tag Unsuccessful. Mulitple Users Are Using The Tag.")
        }
        setEditingTagClicked(true)
        setClickedTagEdit(tag)
    }, [setEditingTagClicked, setClickedTagEdit])

    const handleDeleteTag = useCallback(async (tag) => {
        if (tag.emails.length > 1) {
            return alert("Deleting Tag Unsuccessful. Mulitple Users Are Using The Tag.")
        }
        try {
            const response = await axios.post('http://localhost:8000/deletetag', { tag })
            setQuestions(response.data.questions)
            setTags(response.data.tags)
            setTagsProfile(response.data.tags)
            setUserTags(response.data.usertags)
        } catch (error) {
            alert("Error deleting a tag")
        }
    }, [setQuestions, setTags, setTagsProfile, setUserTags])

    useEffect(() => {
        // Define printTags function inside the useEffect
        const printTags = () => {
            // Get the container element
            var container = document.getElementById('tag-container');
            container.innerHTML = ""
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
                        setProfilePage(false)
                    });
                })(tag.name);

                const editLink = document.createElement('button');
                editLink.textContent = "Edit";

                editLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    handleEditTag(tag);
                });

                const deleteLink = document.createElement('button');
                deleteLink.textContent = "Delete"

                deleteLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    handleDeleteTag(tag);
                });

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
                tagElement.appendChild(editLink)
                tagElement.appendChild(deleteLink)

                // Add a line break after every third tag
                if ((i + 1) % 3 === 0) {
                    container.appendChild(document.createElement('br'));
                }
            }
        };

        // Update the number of tags
        setNumTags(tags.length);
        printTags();
    }, [tags, questions, setFilteredTag, setHomePageVisible, setProfilePage, handleDeleteTag, handleEditTag]);

    return (
        <>
            <div>
                <p id="num-tags" style={{ marginLeft: '60px', marginTop: '60px' }}> {numTags} {numTags === 1 ? 'tag' : 'tags'}</p >
                <p id="All-Tags">User Tags</p>
                <br></br>
                <div id="tag-container" style={{ height: "73vh", maxHeight: "73vh", overflow: "auto" }}>

                </div>
            </div>
        </>
    )
}

export default DisplayUserTags;