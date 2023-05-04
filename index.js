const express = require('express');
const app = express();
const port = 3001;
const connectDB = require('./db.js')
const mongoose = require ('mongoose')
connectDB();

app.use(express.json());
// Define the schema for the Post model
const postSchema = new mongoose.Schema({
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    }
  });
  
  // Create the Post model using the schema
  const Post = mongoose.model('Post', postSchema);


  //Get all posts
app.get('/get-posts', async (req, res) => {
    try {
      const userId = req.headers['user-id'];
      console.log("userid",userId);
        const posts = await Post.find({ userId }).exec();
        res.send(posts);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
});

//Create Post
app.post('/create-posts', async (req, res) => {
    try {
        const { userId, title, body } = req.body;
        if (!title) {
          res.status(400).send('Title is required');
          return;
        }
        const post = new Post({
          userId,
          title,
          body
        });
        await post.save();
        res.send('Post created');
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
}
);

app.listen(port, () => {
  console.log(`Post microservice listening at http://localhost:${port}`);
});