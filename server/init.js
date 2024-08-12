// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/profiles');

let userArgs = process.argv.slice(2);
let email = userArgs[0]
let password = userArgs[1]

mongoose.connect('mongodb://localhost:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true });

const adminCreate = async () => {
    // Hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    // Create a new user"
    const newUser = await User.create({username: "admin", email: email, password: passwordHash, account: "admin"});
    console.log(newUser)
    await newUser.save()
}

adminCreate();

