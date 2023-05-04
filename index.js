const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./db.js')
const { default: mongoose } = require('mongoose');

connectDB();

 // Define User schema
 const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
// Define User model
const User = mongoose.model('User', userSchema);
app.use(express.json());

//register User
app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.create({ username, password });
      res.send('User registered!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
//authenticate User
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username, password });
      if (user) {
        res.send('User authenticated!');
      } else {
        res.status(401).send('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

app.listen(port, () => {
  console.log(`User microservice listening at http://localhost:${port}`);
});
