const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/userModel');

loginRouter.post('/', async(request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  console.log('user is', user);
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.hashedPassword);
  if(!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username and password' });
  }

  const userForToken = {
    username:user.username,
    id: user._id
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  response.status(200).send({ token, username:user.username, name:user.name });
});
module.exports = loginRouter;