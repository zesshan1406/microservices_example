const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./db.js')
const { default: mongoose } = require('mongoose');
const axios = require('axios');

connectDB();
var userID = '';
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
        userID = user.username
        res.send('User authenticated!');

      } else {
        res.status(401).send('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  //Calling Post Microservice by creating a post.

  app.post('/create-post', async (req, res) => {
    if(userID){
      const { title, body } = req.body;
      const postData = {
        title: title,
        body: body,
        userId: userID

      }
        axios.post('http://localhost:3001/posts', postData)
        .then(response => {
          console.log(response.data);
          // Handle successful response from post microservice
          res.send('Post created successfully');
        })
        .catch(error => {
          console.error(error);
          // Handle error from post microservice
          res.status(500).send('Error creating post');
        });
      
    
    }
    else{
      res.send("Please login first before creating post")
    }
    
  });


 

app.listen(port, () => {
  console.log(`User microservice listening at http://localhost:${port}`);
});
