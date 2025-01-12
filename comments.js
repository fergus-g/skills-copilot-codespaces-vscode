// Create web server
// npm install express
// npm install body-parser
// npm install nodemon
// npm install mongoose
// npm install ejs
// npm install express-session
// npm install connect-mongo

// Require modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const app = express();

// Set up ejs
app.set("view engine", "ejs");

// Set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Set up mongoose
mongoose.connect("mongodb://localhost:27017/comments", {
  useNewUrlParser: true,
});

// Create schema
const commentSchema = new mongoose.Schema({
  name: String,
  content: String,
});

// Create model
const Comment = mongoose.model("Comment", commentSchema);

// Set up routes
app.get("/", (req, res) => {
  Comment.find({}, (err, comments) => {
    res.render("index", { comments: comments });
  });
});

app.post("/add", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.redirect("/");
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server started");
});
