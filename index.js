// const express = require('express')
// const cors = require("cors")

// const app = express();
// const PORT = 5000;


// app.use(express.json())
// app.use(cors())


// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://usama_mir:8jzXTs98jfPNxlac@cluster0.6p7sbwz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// app.get('/', async(req, res) =>{
//     res.send('server is runnig on port 5000')
// })

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     const blogCollection = client.db('usama_mir').collection('blog');
//     const messageCollection = client.db('usama_mir').collection('message');


//     app.post('/message', async (req, res) =>{
//       const message = req.body;
//       message.uploadedTime = new Date();
//       const result = await messageCollection.insertOne(message);
//       res.send(result)
//     })

//     app.get('/message', async (req, res) => {
//       const query = {};
//       const messages = await messageCollection.find(query).toArray()
//       res.send(messages)
//     });


//     app.delete('/messages/:id', async(req, res) =>{
//       const id = req.params.id;
//       // Convert the blog_id to ObjectId
//     const objectId = new ObjectId(id);
//     // Use a filter to match the blog with the specified ID
//     const deletedMessage = await messageCollection.findOneAndDelete({
//       _id: objectId,
//     });

//     if (deletedMessage) {
//       res
//         .status(200)
//         .json({ success: true, message: "Blog deleted successfully" });
//     } else {
//       res.status(404).json({ success: false, message: "Blog not found" });
//     }
//   });


//   app.delete('/blog/:id', async(req, res) =>{
//     const id = req.params.id;
//     // Convert the blog_id to ObjectId
//   const objectId = new ObjectId(id);
//   // Use a filter to match the blog with the specified ID
//   const deleteProducts = await blogCollection.findOneAndDelete({
//     _id: objectId,
//   });

//   if (deleteProducts) {
//     res
//       .status(200)
//       .json({ success: true, message: "Blog deleted successfully" });
//   } else {
//     res.status(404).json({ success: false, message: "Blog not found" });
//   }
// })


//     app.post('/blog', async (req, res) =>{
//       const blogData = req.body;
//       const result = await blogCollection.insertOne(blogData);
//       res.send(result)
//     });


//     app.get('/blog', async (req, res) =>{
//       const query = {};
//       const data = await blogCollection.find(query).toArray();
//       res.send(data)
//     });

//     app.get('/blog/fashion', async (req, res) =>{
//       const filter = {category : {$eq: 'fashion'}};
//       const data = await blogCollection.find(filter).toArray();
//       console.log(data)
//       res.send(data)
//     });

//     app.get('/blog/beauty', async (req, res) =>{
//       const filter = {category : {$eq: 'beauty'}};
//       const data = await blogCollection.find(filter).toArray();
//       console.log(data)
//       res.send(data)
//     });

//     app.get('/blog/:id', async (req, res) => {
//       try {
//         const blogId = req.params.id;
//         const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
//         if (!blog) {
//           return res.status(404).json({ message: 'Blog not found' });
//         }
//         res.json(blog);
//       } catch (error) {
//         res.status(500).json({ message: error.message });
//       }
//     });

//   } catch (error){
//     console.log('this is from error', error)
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.listen(PORT, () =>{
//     console.log("the server are running on post 5000")
// })


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: 'https://usama-mir-server-again.vercel.app'
}));

const uri = "mongodb+srv://usama_mir:8jzXTs98jfPNxlac@cluster0.6p7sbwz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    const blogCollection = client.db('usama_mir').collection('blog');
    const messageCollection = client.db('usama_mir').collection('message');


    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    app.post('/message', async (req, res) => {
      try {
        const message = { ...req.body, uploadedTime: new Date() };
        const result = await messageCollection.insertOne(message);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to add message' });
      }
    });

    app.get('/message', async (req, res) => {
      try {
        const messages = await messageCollection.find({}).toArray();
        res.status(200).send(messages);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch messages' });
      }
    });

    app.delete('/message/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await messageCollection.findOneAndDelete({ _id: new ObjectId(id) });
        if (result.value) {
          res.status(200).json({ success: true, message: 'Message deleted successfully' });
        } else {
          res.status(404).json({ success: false, message: 'Message not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
      }
    });

    app.post('/blog', async (req, res) => {
      try {
        const blogData = req.body;
        const result = await blogCollection.insertOne(blogData);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to add blog' });
      }
    });

    app.get('/blog', async (req, res) => {
      try {
        const blogs = await blogCollection.find({}).toArray();
        res.status(200).send(blogs);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch blogs' });
      }
    });

    app.get('/blog/fashion', async (req, res) => {
      try {
        const data = await blogCollection.find({ category: 'fashion' }).toArray();
        res.status(200).send(data);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch fashion blogs' });
      }
    });

    app.get('/blog/beauty', async (req, res) => {
      try {
        const data = await blogCollection.find({ category: 'beauty' }).toArray();
        res.status(200).send(data);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch beauty blogs' });
      }
    });

    app.get('/blog/:id', async (req, res) => {
      try {
        const blogId = req.params.id;
        const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blog' });
      }
    });

    app.delete('/blog/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await blogCollection.findOneAndDelete({ _id: new ObjectId(id) });
        if (result.value) {
          res.status(200).json({ success: true, message: 'Blog deleted successfully' });
        } else {
          res.status(404).json({ success: false, message: 'Blog not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog' });
      }
    });

  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
