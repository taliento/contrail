const express = require("express");
const bodyParser = require("body-parser");
// const mongodb = require("mongodb");
// const ObjectID = mongodb.ObjectID;
const path = require('path');
const unirest = require("unirest");
const cors = require("cors");

const skyscannerDomain = "skyscanner-skyscanner-flight-search-v1.p.mashape.com";
const skyScannerEndPoint = "https://"+skyscannerDomain+"/apiservices";

const USERS_COLLECTION = "users";

const app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Create link to Angular build directory
const distDir = __dirname + "/dist/contrail/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
// var db;

// Connect to the database before starting the application server.
// mongodb.MongoClient.connect(
//   process.env.MONGODB_URI || "mongodb://localhost:27017/test",
//   function(err, client) {
//     if (err) {
//       console.log(err);
//       process.exit(1);
//     }
//
//     // Save database object from the callback for reuse.
//     db = client.db();
//     console.log("Database connection ready");
//
//     // Initialize the app.
//     var server = app.listen(process.env.PORT || 3000, function() {
//       var port = server.address().port;
//       console.log("App now running on port", port);
//     });
//   }
// );



// USERS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

/*  "/api/users"
 *    GET: finds all users
 *    POST: creates a new user
 */

app.get("/api/users", function(req, res) {});

app.post("/api/users", function(req, res) {});

/*  "/api/users/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */

app.get("/api/users/:id", function(req, res) {});

app.put("/api/users/:id", function(req, res) {});

app.delete("/api/users/:id", function(req, res) {});

// FLIGHT api

const SUFFIX = "/api/skyscanner/";

app.post(SUFFIX + "createSession", function(req, res) {
  console.log("creating session...");

  unirest
    .post(skyScannerEndPoint + "/pricing/v1.0")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
    .header(
      "X-Mashape-Host",
      skyscannerDomain
    )
    .send("country=IT") //FIXME CLIENT INFO
    .send("currency=EUR") //FIXME CLIENT INFO
    .send("locale=it") //FIXME CLIENT INFO
    .send("originPlace=" + req.body.originPlace.PlaceId)
    .send("destinationPlace=" + req.body.destinationPlace.PlaceId)
    .send("outboundDate=" + req.body.outboundDate)
    .send("inboundDate=" + req.body.inboundDate)
    .send("cabinClass=" + req.body.cabinClass)
    .send("adults=" + req.body.adults)
    .send("children=" + req.body.children)
    .send("infants=0")
    .send("includeCarriers=")
    .send("excludeCarriers=")
    .end(result => {

      return result.status >= 200 && result.status < 300
        ? res.send({ location: result.headers.location })
        : res.status(400).send(result.body);
    });
});

app.get(SUFFIX + "getPlaces/:query", function(req, res) {
  //FIXME CLIENT INFO
  var uri =
    skyScannerEndPoint +
    "/autosuggest/v1.0/IT/EUR/it/?query=" +
    req.params.query;

  unirest
    .get(uri)
    .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
    .header(
      "X-Mashape-Host",
      skyscannerDomain
    )
    .end(function(result) {

      return result.status >= 200 && result.status < 300
        ? res.send(result.body)
        : res.status(400).send(result.body);
    });
});

app.get(SUFFIX + "pollSessionResults/:sessionkey/:stops", function(req, res) {
  //FIXME PAGING
  var uri =
    skyScannerEndPoint +
    "/pricing/uk2/v1.0/" +
    req.params.sessionkey +
    "/?pageIndex=0&pageSize=10";

  if (req.params.stops >= 0) {
    uri += "&stops=" + req.params.stops;
  }

  unirest
    .get(uri)
    .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
    .header(
      "X-Mashape-Host",
      skyscannerDomain
    )
    .end(function(result) {
      return result.status >= 200 && result.status < 300
        ? res.send(result.body)
        : res.status(400).send(result.body);
    });
});

// application -------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(distDir + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// Initialize the app.
var server = app.listen(process.env.PORT || 3000, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
