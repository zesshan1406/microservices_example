const express = require('express');
const app = express();
const port = 3002;
const connectDB = require('./db.js')
const { default: mongoose } = require('mongoose');
const axios = require('axios');

connectDB();
app.use(express.json());

// Define the schema for the Comment model
const commentSchema = new mongoose.Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  });

  // Create the Comment model using the schema
  const Comment = mongoose.model('Comment', commentSchema);

  //Get all comments from post
app.get('/get-comments/', async (req, res) => {
    try {
      const postId = req.headers['post-id'];
      console.log("postid",postId);
        const comments = await Comment.find({ postId }).exec();
        res.send(comments);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
});


//Post comments to a post 

app.post('/post-comment/', async (req, res) => {
    try {
        const {postId , comment} = req.body
        const comments = new Comment({
            postId,
            comment
          });
        await comments.save();
        res.send('Comments posted');
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
});


 

app.listen(port, () => {
  console.log(`User microservice listening at http://localhost:${port}`);
});