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
    const postId = req.query.postId;
    console.log("postid", postId);
    console.log("query", req.query)
    const comments = await Comment.find({ postId }).exec();
    res.send(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


//Post comments to a post 

app.post('/post-comments/', async (req, res) => {
    try {
        const {postId , comment} = req.body
        const comments = new Comment({
            postId,
            comment
          });
       const result =  await comments.save();
        res.send({message:'Comment Posted!',description:result});
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
});


 

app.listen(port, () => {
  console.log(`Comment microservice listening at http://localhost:${port}`);
});