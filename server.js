const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;
const unirest = require('unirest');
const cors = require('cors');

const USERS_COLLECTION = "users";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Create link to Angular build directory
const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// USERS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/users"
 *    GET: finds all users
 *    POST: creates a new user
 */

app.get("/api/users", function(req, res) {
});

app.post("/api/users", function(req, res) {
});

/*  "/api/users/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */

app.get("/api/users/:id", function(req, res) {
});

app.put("/api/users/:id", function(req, res) {
});

app.delete("/api/users/:id", function(req, res) {
});


// FLIGHT api



app.post("/api/skyscanner/createSession", function(req, res) {

    unirest.post("https://skyscanner-skyscanner-flight-search-v1.p.mashape.com/apiservices/pricing/v1.0")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("X-Mashape-Key", process.env.SKYSCANNER-KEY)
    .header("X-Mashape-Host", "skyscanner-skyscanner-flight-search-v1.p.mashape.com")
    .send("country=IT") //FIXME CLIENT INFO
    .send("currency=EUR") //FIXME CLIENT INFO
    .send("locale=it") //FIXME CLIENT INFO
    .send("originPlace="+req.body.originPlace.PlaceId)
    .send("destinationPlace="+req.body.destinationPlace.PlaceId)
    .send("outboundDate=2018-11-01")
    .send("inboundDate=2018-11-10")
    .send("cabinClass=business")
    .send("adults="+req.body.adults)
    .send("children=0")
    .send("infants=0")
    .send("includeCarriers=")
    .send("excludeCarriers=")
    .end(result => {
      console.log(result.status, result.headers, result.body);

      return (result.status >= 200 && result.status < 300) ?
              res.send({location: result.headers.location}) :
              res.status(400).send(result.body);
    });

});



app.get("/api/skyscanner/getPlaces/:query", function(req, res) {
  unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.mashape.com/apiservices/autosuggest/v1.0/UK/GBP/en-GB/?query=" + req.params.query)
  .header("X-Mashape-Key", process.env.SKYSCANNER-KEY)
  .header("X-Mashape-Host", "skyscanner-skyscanner-flight-search-v1.p.mashape.com")
  .end(function (result) {
    console.log(result.status, result.headers, result.body);

    return (result.status >= 200 && result.status < 300) ?
            res.send(result.body) :
            res.status(400).send(result.body);
  });
});
