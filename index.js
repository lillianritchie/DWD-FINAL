//libraries
const fs = require('fs');
const path = require('path');
const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');

//port variable
const PORT = config.PORT;

//mongoose connection stuff
const MONGODB_URI = config.MONGODB_URI;
const mongoose = require('mongoose');
//connect to the database that's living in the cloud
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDb connected"))
  .catch(err => console.log(err));

//declare variables for my db and my app
const db = require('./models/comments');
const app = express();

//set up body parser to read json
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//set the path to your public directory
app.use(express.json());
const publicURL = path.resolve(__dirname + "/public");

// Set your static server
app.use(express.static(publicURL));

// Set your static html file
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/public/views/index.html"))
});

// ---- ADD YOUR API ENDPOINTS HERE ----
app.get("/api/v1/comments", async (req, res) => {
  //all async functions need to have a try and a catch
  try {
    //this 
    const data = await db.find();
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

app.post("/api/v1/comments", async (req, res) => {
  //all async functions need to have a try and a catch
  try {
    const newData = {
      "name": req.body.name,
      "location": req.body.location,
      "email": req.body.email,
      "comment": req.body.comment

    }
    const data = await db.create(newData);
    console.log(newData);
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});


app.put("/api/v1/comments/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const updatedData = {
      name: req.body.name,
      location: req.body.location,
      email: req.body.email,
      comment: req.body.comment
    }
    const changedData = await db.findOneAndUpdate({
      _id: id
    }, updatedData, {
      new: true
    });

    res.json(changedData);

  } catch (error) {
    res.json(error);
  }
});

app.delete("/api/v1/comments/:id", async (req, res) => {
  //all async functions need to have a try and a catch
  try {
    const id = req.params.id;
    //console.log(id);
    const deletedData = await db.findByIdAndDelete(id);
    res.json({
      message: "delete!",
      deletedDocument: deletedData
    });
  } catch (error) {
    res.json(error);
  }
});


// Start listening
app.listen(PORT, () => {
  console.log(`see the magic: http://localhost:${PORT}`);
})