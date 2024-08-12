// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
var cors = require('cors')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb://localhost:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(express.json())
app.use(cookieParser())
const PORT = 8000;

let Question = require('./models/questions')
let Tag = require('./models/tags')
let Answer = require('./models/answers')
let User = require('./models/profiles');
let Comment = require('./models/comments')

const server = app.listen(PORT, () => {
    console.log("server is running");
});

app.get('/accountType', verifyToken, async (req, res) => {
    try {
        const { email } = req.query;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const accountType = existingUser.account;
            res.status(200).json({ accountType });

        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/questions', async (req, res) => {
    try {
        const items = await Question.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/users', async (req, res) => {
    try {
        const items = await User.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/answers', async (req, res) => {
    try {
        const items = await Answer.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/tags', async (req, res) => {
    try {
        const items = await Tag.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/comments', async (req, res) => {
    try {
        const items = await Comment.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/addtag', verifyToken, async (req, res) => {
    try {
        const { name, username } = req.body;
        let newTag = await Tag.create({ name: name });
        newTag.emails.push(username);
        newTag.save()
        const updatedTags = await Tag.find();
        res.status(200).json(updatedTags);
    } catch (error) {
        console.error('Error adding tag server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/addtaguser', async (req, res) => {
    try {
        const { tagId, username } = req.body;
        let newTag = await Tag.findById(tagId);
        if (newTag.emails.includes(username) === false) {
            newTag.emails.push(username);
        }
        newTag.save()
        const updatedTags = await Tag.find();
        res.status(200).json(updatedTags);
    } catch (error) {
        console.error('Error adding tag server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/updatetags', async (req, res) => {
    try {
        const { originalTags, username } = req.body;
        for (const tagId of originalTags) {
            let tag = await Tag.findById(tagId);
            tag.emails = tag.emails.filter(email => email !== username);
            await tag.save()
            if (tag.emails.length === 0) {
                await Tag.findByIdAndDelete(tagId)
            }
        }
        const updatedTags = await Tag.find();
        res.status(200).json(updatedTags);
    } catch (error) {
        console.error('Error adding tag server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/edittags', async (req, res) => {
    try {
        const { tag, questionTags } = req.body;
        let tagId = tag._id
        let email = tag.emails[0]
        await Tag.findByIdAndUpdate(tagId, { name: questionTags })
        const updatedTags = await Tag.find();
        const userTags = await Tag.find({ emails: { $in: [email] } });
        const updatedQuestion = await Question.find();
        res.status(200).json({ tags: updatedTags, questions: updatedQuestion, usertags: userTags });
    } catch (error) {
        console.error('Error adding tag server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/addanswer', async (req, res) => {
    try {
        const { text, usernameDisplay, email } = req.body
        let newAnswer = await Answer.create({ text: text, ans_by: usernameDisplay, email: email })
        newAnswer.save()
        const updatedAnswers = await Answer.find();
        res.status(200).json(updatedAnswers)
    } catch (error) {
        console.error('Error adding answer server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/addQuestion', verifyToken, async (req, res) => {
    try {
        const { title, text, newTagIds, answers, usernameDisplay, summary, email } = req.body;
        let newQuestion = await Question.create({ title: title, text: text, tags: newTagIds, answers: answers, asked_by: usernameDisplay, summary: summary, email: email });
        newQuestion.save()
        const updatedQuestion = await Question.find();
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error('Error adding question server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/updateQuestion', verifyToken, async (req, res) => {
    try {
        const { questionId, title, text, newTagIds, summary } = req.body;
        const newQuestion = await Question.findByIdAndUpdate(questionId, { title: title, text: text, tags: newTagIds, summary: summary }, { new: true });
        newQuestion.save()
        const updatedQuestion = await Question.find();
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error('Error adding question server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/deletequestion', verifyToken, async (req, res) => {
    try {
        const { questionId, questionAnswers, questionComments } = req.body;
        // deal with answers/comments first
        for (const answerId of questionAnswers) {
            const answer = await Answer.findById(answerId)
            const commentsInAnswer = answer.comments
            for (const commentId of commentsInAnswer) {
                await Comment.findByIdAndDelete(commentId.toString())
            }
            await Answer.findByIdAndDelete(answerId)
        }

        // deal with question comments
        for (const commentId of questionComments) {
            await Comment.findByIdAndDelete(commentId)
        }

        // delete question
        await Question.findByIdAndDelete(questionId)

        const updatedQuestion = await Question.find();
        const updatedAnswers = await Answer.find();
        res.status(200).json({ answers: updatedAnswers, questions: updatedQuestion })

    } catch (error) {
        console.error('Error adding question server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/addquestionclick', verifyToken, async (req, res) => {
    res.status(200).send({ success: true });
})


// middleware for authentication

function verifyToken(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

app.get("/", verifyToken, async (req, res) => {
    res.status(200).send({ success: true, user: req.user });
});

app.get('/reputation', verifyToken, async (req, res) => {
    try {
        const { email } = req.query;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const reputation = existingUser.reputation;
            res.status(200).json({ reputation });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(453).json({ error: 'Email is already registered, please try again.' });
        }

        // Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({ email, password: passwordHash, username });
        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, email, username } });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(453).json({ error: 'Email not found.' });
        }

        if (await bcrypt.compare(password, existingUser.password)) {
            const token = jwt.sign({ email: email, username: existingUser.username }, process.env.ACCESS_TOKEN_SECRET);
            res.cookie('jwt', token, { httpOnly: true }).status(200).json({
                success: true,
                user: {
                    email: existingUser.email,
                }
            }).send();
        } else {
            return res.status(454).json({ error: "Wrong password." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/upvote', async (req, res) => {
    const { email, questionId } = req.body;
    try {
        const user = await User.findOne({ email: email });
        await Question.findByIdAndUpdate(questionId, { $inc: { votes: 1 } }, { new: true })
        user.reputation = user.reputation + 5;
        await user.save();
        const updatedQuestion = await Question.find();
        res.status(200).json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/upvoteanswer', async (req, res) => {
    const { email, answerId } = req.body;
    try {
        const user = await User.findOne({ email: email });
        await Answer.findByIdAndUpdate(answerId, { $inc: { votes: 1 } }, { new: true })
        user.reputation = user.reputation + 5;
        await user.save();
        const updatedAnswers = await Answer.find();
        res.status(200).json(updatedAnswers);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/upvotecomment', async (req, res) => {
    const { commentId } = req.body;
    try {
        await Comment.findByIdAndUpdate(commentId, { $inc: { votes: 1 } }, { new: true })
        const updatedComments = await Comment.find();
        res.status(200).json(updatedComments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/downvoteanswer', async (req, res) => {
    const { email, answerId } = req.body;
    try {
        const user = await User.findOne({ email: email });
        await Answer.findByIdAndUpdate(answerId, { $inc: { votes: -1 } }, { new: true })
        user.reputation = user.reputation - 10;
        await user.save();
        const updatedAnswers = await Answer.find();
        res.status(200).json(updatedAnswers);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/downvote', async (req, res) => {
    const { email, questionId } = req.body;
    try {
        const user = await User.findOne({ email: email });
        await Question.findByIdAndUpdate(questionId, { $inc: { votes: -1 } }, { new: true })
        user.reputation = user.reputation - 10;
        await user.save();
        const updatedQuestion = await Question.find();
        res.status(200).json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/addcommentquestion', async (req, res) => {
    try {
        const { currentQuestionComment, usernameDisplay, username } = req.body
        let newcomment = await Comment.create({ text: currentQuestionComment, com_by: usernameDisplay, email: username })
        newcomment.save()
        const updatedComments = await Comment.find()
        res.status(200).json({ comment: newcomment, comments: updatedComments })
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.put('/question/updatecomments', async (req, res) => {
    try {
        const { questionId, comment } = req.body
        await Question.findByIdAndUpdate(questionId, { $push: { comments: comment } }, { new: true })
        const updatedQuestion = await Question.find()
        res.status(200).json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.put('/answer/updatecomments', async (req, res) => {
    try {
        const { answerId, comment } = req.body
        await Answer.findByIdAndUpdate(answerId, { $push: { comments: comment } }, { new: true })
        const updatedAnswers = await Answer.find()
        res.status(200).json(updatedAnswers);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post("/logout", async (req, res) => {
    res.cookie("jwt", '', { maxAge: 1 }).send();
})

app.put('/questions/:id/incviews', async (req, res) => {
    try {
        const { questionId } = req.body;
        await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } }, { new: true });
        const updatedQuestion = await Question.find();
        res.status(200).json(updatedQuestion);
    } catch (err) {
        console.error('Error updating views:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put(`/questions/:id/updateanswers`, async (req, res) => {
    try {
        const { questionId, answer } = req.body
        await Question.findByIdAndUpdate(questionId, { $push: { answers: answer } }, { new: true })
        const updatedQuestion = await Question.find();
        res.status(200).json(updatedQuestion);
    } catch (err) {
        console.error('Error updating answers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/createdBy', async (req, res) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const timestampOfCreation = user.created_date_time;
        res.status(200).json({ timestampOfCreation });
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/userquestions', async (req, res) => {
    const { email } = req.query

    try {
        const userQuestions = await Question.find({ email: email });
        res.status(200).json(userQuestions);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.get("/usertags", async (req, res) => {
    const { email } = req.query
    try {
        const userTags = await Tag.find({ emails: { $in: [email] } });
        res.status(200).json(userTags);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/useranswers', async (req, res) => {
    const { email } = req.query
    try {
        const userAnswers = await Answer.find({ email: email });
        let listAnswered = []
        // contains the id object
        let listQuestionIdAnswered = []
        // contains the id string
        let listQuestionIdAnsweredId = []

        for (const answer of userAnswers) {
            const userAnswered = await Question.findOne({ answers: answer._id })
            if (listQuestionIdAnsweredId.includes(userAnswered._id.toString()) === false) {
                listAnswered.push(userAnswered)
                listQuestionIdAnswered.push(userAnswered._id)
                listQuestionIdAnsweredId.push(userAnswered._id.toString())
            }
        }

        listAnswered.sort(function (q1, q2) {
            let q2Date = new Date(q2.asked_date_time)
            let q1Date = new Date(q1.asked_date_time)
            return q2Date - q1Date
        });

        res.status(200).json(listAnswered);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/gettags', async (req, res) => {
    const { tags } = req.query
    try {
        const listoftagnames = []

        for (const tagId of tags) {
            const tag = await Tag.findById(tagId)
            listoftagnames.push(tag.name)
        }

        tagstring = listoftagnames.join(' ')
        res.status(200).json(tagstring);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/updateanswer', async (req, res) => {
    const { text, answerId } = req.body
    try {
        await Answer.findByIdAndUpdate(answerId, { text: text }, { new: true })
        const updatedAnswers = await Answer.find();
        res.status(200).json(updatedAnswers);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/deleteanswer', async (req, res) => {
    const { questionId, answerId } = req.body
    try {
        const question = await Question.findById(questionId);
        question.answers = question.answers.filter(answer => answer._id.toString() != answerId)
        await question.save()
        await Answer.findByIdAndDelete(answerId)
        const updatedAnswers = await Answer.find();
        const updatedQuestion = await Question.find();
        res.status(200).json({ answers: updatedAnswers, questions: updatedQuestion });
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/deletetag', async (req, res) => {
    const { tag } = req.body
    let tagId = tag._id
    let email = tag.emails[0]
    try {
        const questionsWithTag = await Question.find({ tags: tag._id })
        await Tag.findByIdAndDelete(tagId)
        for (const question of questionsWithTag) {
            let newarray = question.tags.filter(tag => tag._id.toString() != tagId)
            if (newarray.length === 0) {
                const findUntagged = await Tag.findOne({ name: "untagged" })
                if (!findUntagged) {
                    let newTag = await Tag.create({ name: "untagged" });
                    newTag.emails.push(email);
                    await newTag.save()
                    newarray.push(newTag)
                    question.tags = newarray
                } else {
                    let arrayusers = findUntagged.emails
                    if (arrayusers.includes(email) === false) {
                        await Tag.findByIdAndUpdate(findUntagged._id.toString(), { $push: { emails: email } }, { new: true })
                    }
                    newarray.push(findUntagged)
                    question.tags = newarray
                }
            } else {
                question.tags = question.tags.filter(tag => tag._id.toString() != tagId)
            }
            await question.save();
        }
        const updatedTags = await Tag.find();
        const userTags = await Tag.find({ emails: { $in: [email] } });
        const updatedQuestion = await Question.find();
        res.status(200).json({ tags: updatedTags, questions: updatedQuestion, usertags: userTags });
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/getAdminId', async (req, res) => {
    const { username } = req.body
    try {
        const user = await User.findOne({ email: username })
        let Id = user._id
        res.status(200).json(Id)
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/getAdmin', async (req, res) => {
    const { accountId } = req.body
    try {
        const user = await User.findById(accountId)
        let name = user.username
        let email = user.email
        let reputation = user.reputation
        res.status(200).json({ name, email, reputation })
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/deleteuser', async (req, res) => {
    const { user } = req.body
    try {
        let useremail = user.email
        // delete the comments
        let userComments = await Comment.find({ email: useremail })
        for (const comment of userComments) {
            let commentId = comment._id
            let userAnswer = await Answer.findOne({ comments: comment })
            if (userAnswer) {
                userAnswer.comments = userAnswer.comments.filter(comment => comment._id.toString() != commentId.toString())
                await userAnswer.save()
            }
            let userQuestion = await Question.findOne({ comments: comment })
            if (userQuestion) {
                userQuestion.comments = userQuestion.comments.filter(comment => comment._id.toString() != commentId.toString())
                await userQuestion.save()
            }
            await Comment.findByIdAndDelete(commentId.toString())
        }

        // find the tags 
        let userTags = await Tag.find({ emails: useremail })

        for (const tag of userTags) {
            tag.emails = tag.emails.filter(email => email !== useremail);
            await tag.save()
            if (tag.emails.length === 0) {
                await Tag.findByIdAndDelete(tag._id.toString())
            }
        }

        // find the answers
        let userAnswers = await Answer.find({ email: useremail })

        for (const answer of userAnswers) {
            let userQuestion = await Question.findOne({ answers: answer })
            userQuestion.answers = userQuestion.answers.filter(ans => ans._id.toString() != answer._id.toString())
            await userQuestion.save()
            await Answer.findByIdAndDelete(answer._id.toString())
        }
        // find the questions
        let allUserQuestions = await Question.find({email: useremail})

        for (const question of allUserQuestions) {
            // deal with the comments first
            let questionComments = question.comments
            for (const comment of questionComments) {
                await Comment.findByIdAndDelete(comment._id.toString())
            }

            let questionAnswers = question.answers
            for (const answer of questionAnswers) {
                let answerComments = answer.comments
                for (const comment in answerComments) {
                    await Comment.findByIdAndDelete(comment._id.toString())
                }
                await Answer.findByIdAndDelete(answer._id.toString())
            }

            await Question.findByIdAndDelete(question._id.toString())
        }

        // delete the user
        await User.findByIdAndDelete(user._id.toString())
        const answers = await Answer.find()
        const questions = await Question.find()
        const tags = await Tag.find()
        const users = await User.find()

        res.status(200).json({answers: answers, questions: questions, tags: tags, users: users})


    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

process.on('SIGINT', () => {
    mongoose.connection.close()
    server.close(() => {
        console.log('\nServer closed. Database instance disconnected')
    });
});

