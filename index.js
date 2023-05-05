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
      res.send({message:'User registered!',description:user});
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
        res.send({message:'User authenticated!',description:user});

      } else {
        res.status(401).send('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  //Calling Post Microservice to get all posts regardless of users

  app.get('/get-all-posts', async (req, res) => {
    if(userID){
      const headers = {
        'user-id': userID
      }
      
        axios.get('http://localhost:3001/get-all-posts')
        .then(response => {
          console.log(response.data);
          // Handle successful response from post microservice
          res.send({message:'All posts retrieved successfully',description:response.data});
        })
        .catch(error => {
          console.error(error);
        // Handle error from post microservice
          res.status(500).send('Error getting posts');
        });
      
    
    }
    else{
      res.send("Please login first before getting all posts")
    }
    
  });



  //Calling Post Microservice by getting all posts made by logged in users

  app.get('/get-posts', async (req, res) => {
    if(userID){
      const headers = {
        'user-id': userID
      }
      
        axios.get('http://localhost:3001/get-posts', {
          headers: headers
        })
        .then(response => {
          console.log(response.data);
          // Handle successful response from post microservice
          res.send({message:'All posts retrieved successfully',description:response.data});
        })
        .catch(error => {
          console.error(error);
        // Handle error from post microservice
          res.status(500).send('Error getting posts');
        });
      
    
    }
    else{
      res.send("Please login first before getting all posts")
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
        axios.post('http://localhost:3001/create-posts', postData)
        .then(response => {
          console.log(response.data);
          // Handle successful response from post microservice
          res.send({message:'Post created successfully',description:response.data});
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




  //Get comments from a specific post
  
  app.get('/get-comments/:postId', async (req, res) => {
    if (userID) {
      const postId = req.params.postId; // set the postId value
      axios.get(`http://localhost:3002/get-comments?postId=${postId}`, {
        params: {
          postId: postId
        }
      })
        .then(response => {
          console.log(response.data);
          // Handle successful response from post microservice
          res.send({message:'Comments retrieved',description:response.data});
        })
        .catch(error => {
          console.error(error);
          // Handle error from post microservice
          res.status(500).send('Error retrieving comments');
        });
    }
    else {
      res.send("Please login first before retrieving comments")
    }
  });


  //Post comments from a specific post
  
  app.post('/post-comments', async (req, res) => {
    if(userID){
      const { postId, comment } = req.body;
      const postData = {
        postId: postId,
        comment: comment,
      }
     
          axios.post('http://localhost:3002/post-comments',postData) //{headers: headers})
        .then(response => {
          console.log(response.data);
          // Handle successful response from post microservice
          res.send({message:'Comment Posted!',description:response.data});
        })
        .catch(error => {
          console.error(error);
          // Handle error from post microservice
          res.status(500).send('Error posting comments');
        });
      
    
    }
    else{
      res.send("Please login first before retrieving comments")
    }
    
  });



 

app.listen(port, () => {
  console.log(`User microservice listening at http://localhost:${port}`);
});
