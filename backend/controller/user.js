const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const User = require('../models/user');

async function signup(req, res) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      res.json({ message: 'Incomplete queries' });
    }

    const validateUser = await User.findOne({ name });
    if (validateUser) {
      res.json({ message: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();
    
    res.json({ message: 'Created new user', newUser });
  } catch (err) {
    console.log(err);
  }
}

async function login(req, res) {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) {
      res.json({ message: 'User does not exists' });
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      res.json({ message: 'Incorrect password' });
    }

    // generate token
    // key should not be like this
    const accessToken = jwt.sign({ id: user._id }, "THIS_IS_A_SECRET");
    res.cookie('access-token', accessToken, { maxAage: 60*60*24*30*1000, httpOnly: true });
    
    res.json({ message: `Welcome! ${user.name}`, accessToken })
  } catch (err) {
    console.log(err);
  }
}

async function addContact(req, res) {
  try {
    const { userToAddId } = req.params;
    const userToAdd = await User.findById(userToAddId);

    // Get the logged in user that is basically the req.user declared after the authentication
    const you = req.user;

    if (you.contactList.includes(userToAdd._id)) {
      res.json({ message: 'Already on list' });
    }

    await you.updateOne({ $push: { contactList: userToAdd._id } });
    await userToAdd.updateOne({ $push: { contactList: you._id } });

  } catch (err) {
    console.log(err);
  }
}

async function displayProfile(req, res) {
  try {
    const { name, contactList } = await User.findById(req.user.id);

    res.json({ name, contactList });
  } catch (err) {
    console.log(err);
  }
}

async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    const toDelete = await User.findById(id);
    const you = req.user;

    if (!you.contactList.includes(friend._id)) {
      res.json({ message: "You're not friends" });
    }
    await you.updateOne({ $pull: { contactList: toDelete._id } });
    await toDelete.update({ $pull: { contactList: you._id } });

    res.json({ message: 'Success' });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { signup, login, addContact, displayProfile, deleteContact };