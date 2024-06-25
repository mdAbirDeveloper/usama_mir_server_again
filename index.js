const express = require('express')
const cors = require("cors")

const app = express();
const PORT = 5000;


app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://usama_mir:8jzXTs98jfPNxlac@cluster0.6p7sbwz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', async(req, res) =>{
    res.send('server is runnig on port 5000')
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const blogCollection = client.db('usama_mir').collection('blog');
    const messageCollection = client.db('usama_mir').collection('message');


    app.post('/message', async (req, res) =>{
      const message = req.body;
      message.uploadedTime = new Date();
      const result = await messageCollection.insertOne(message);
      res.send(result)
    })

    app.get('/message', async (req, res) => {
      const query = {};
      const messages = await messageCollection.find(query).toArray()
      res.send(messages)
    });


    app.delete('/messages/:id', async(req, res) =>{
      const id = req.params.id;
      // Convert the blog_id to ObjectId
    const objectId = new ObjectId(id);
    // Use a filter to match the blog with the specified ID
    const deletedMessage = await messageCollection.findOneAndDelete({
      _id: objectId,
    });

    if (deletedMessage) {
      res
        .status(200)
        .json({ success: true, message: "Blog deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Blog not found" });
    }
  });


  app.delete('/blog/:id', async(req, res) =>{
    const id = req.params.id;
    // Convert the blog_id to ObjectId
  const objectId = new ObjectId(id);
  // Use a filter to match the blog with the specified ID
  const deleteProducts = await blogCollection.findOneAndDelete({
    _id: objectId,
  });

  if (deleteProducts) {
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } else {
    res.status(404).json({ success: false, message: "Blog not found" });
  }
})


    app.post('/blog', async (req, res) =>{
      const blogData = req.body;
      const result = await blogCollection.insertOne(blogData);
      res.send(result)
    });


    app.get('/blog', async (req, res) =>{
      const query = {};
      const data = await blogCollection.find(query).toArray();
      res.send(data)
    });

    app.get('/blog/fashion', async (req, res) =>{
      const filter = {category : {$eq: 'fashion'}};
      const data = await blogCollection.find(filter).toArray();
      console.log(data)
      res.send(data)
    });

    app.get('/blog/beauty', async (req, res) =>{
      const filter = {category : {$eq: 'beauty'}};
      const data = await blogCollection.find(filter).toArray();
      console.log(data)
      res.send(data)
    });

    app.get('/blog/:id', async (req, res) => {
      try {
        const blogId = req.params.id;
        const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

  } catch (error){
    console.log('this is from error', error)
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () =>{
    console.log("the server are running on post 5000")
})
