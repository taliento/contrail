/* jshint node: true */
"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;
const path = require("path");
const unirest = require("unirest");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const skyscannerDomain = "skyscanner-skyscanner-flight-search-v1.p.mashape.com";
const skyScannerEndPoint = "https://" + skyscannerDomain + "/apiservices";

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
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/contrail",
  function(err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 3000, function() {
      var port = server.address().port;
      console.log("App now running on port", port);
    });
  }
);

//API location
// use JWT auth to secure the api
app.use(expressJwt({
  secret: process.env.SECRET
}).unless({
  path: require('./routes/public-routes')
}));

// USERS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

//AUTH USER
app.post("/api/signin", function(req, res) {
  let userParam = req.body;
  db.collection(USERS_COLLECTION).findOne(
    {
      email: userParam.email
    },
    (err, user) => {
      if (err) res.status(500).send(err.name + ": " + err.message);

      if (user && bcrypt.compareSync(userParam.password, user.hash)) {
        // authentication successful
        res.send({
          _id: user._id,
          email: user.email,
          name: user.name,
          token: jwt.sign(
            {
              sub: user._id
            },
            process.env.SECRET
          )
        });
      } else {
        // authentication failed
        res.status(404).send("No user was found!");
      }
    }
  );
});

//CREATE USER
app.post("/api/signup", function(req, res) {
  let userParam = req.body;

  // validation
  db.collection(USERS_COLLECTION).findOne(
    {
      email: userParam.email
    },
    (err, user) => {
      if (err) res.status(500).send(err.name + ": " + err.message);
      if (user) {
        res.status(401).send('Email "' + userParam.email + '" already exists');
      } else {
        createUser();
      }
    }
  );

  function createUser() {
    // set user object to userParam without the cleartext password
    let user = _.omit(userParam, "password");
    user.insertDate = new Date();
    // add hashed password to user object
    user.hash = bcrypt.hashSync(userParam.password, 10);

    db.collection(USERS_COLLECTION).insertOne(user, (err, doc) => {
      if (err) res.status(401).send(err.name + ": " + err.message);
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
        token: jwt.sign(
          {
            sub: user._id
          },
          process.env.SECRET
        )
      });
    });
  }
});

// FLIGHT api

const SUFFIX = "/api/skyscanner/";

app.post(SUFFIX + "createSession", function(req, res) {
  unirest
    .post(skyScannerEndPoint + "/pricing/v1.0")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
    .header("X-Mashape-Host", skyscannerDomain)
    .send("country=" + req.body.country)
    .send("currency=" + req.body.currency)
    .send("locale=" + req.body.locale)
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

      if(result.status >= 200 && result.status < 300) {

        const locationUrl = result.headers.location;
        const sessionkey = locationUrl.substring(
          locationUrl.lastIndexOf("/") + 1,
          locationUrl.length
        );

        var session = {};
        session.startDate = new Date();
        session.sessionkey = sessionkey;
        session.user = req.body.user;

        db.collection("sessions").insertOne(session, (err, doc) => {
          if (err) res.status(401).send(err.name + ": " + err.message);
          res.send({ sessionkey: sessionkey });
        });

      } else {
        console.log("ERROR:"+JSON.stringify(result.body))
        res.status(400).send(result.body);
      }

    });
});

app.get(SUFFIX + "getPlaces/:query", function(req, res) {
  return getPlaces(req.params.query,res);
} );

function getPlaces(query, res) {
  var uri =
    skyScannerEndPoint +
    "/autosuggest/v1.0/IT/EUR/it/?query=" +
    query;

  unirest
    .get(uri)
    .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
    .header("X-Mashape-Host", skyscannerDomain)
    .end(function(result) {
      if (result.status >= 200 && result.status < 300) {
        return res.send(result.body);
      } else {
        console.log("ERROR:"+JSON.stringify(result.body))
        return res.status(400).send(result.body);
      }
    });
}

app.get(SUFFIX + "pollSessionResults/:sessionkey/:stops", function(req, res) {
  var uri = skyScannerEndPoint + "/pricing/uk2/v1.0/" + req.params.sessionkey;

  uri += "?sortType=price&sortOrder=asc";
  if (req.params.stops >= 0) {
    uri += "&stops=" + req.params.stops;
  }

  unirest
    .get(uri)
    .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
    .header("X-Mashape-Host", skyscannerDomain)
    .end(function(result) {
      if (result.status >= 200 && result.status < 300) {
        return res.send(result.body);
      } else {
        console.log("ERROR:"+JSON.stringify(result.body))
        return res.status(400).send(result.body);
      }
    });
});

app.get(
  SUFFIX + "pollSessionResults/:sessionkey/:stops/:pageIndex/:pageSize",
  function(req, res) {
    // paginated
    var uri = skyScannerEndPoint + "/pricing/uk2/v1.0/" + req.params.sessionkey;
    if (req.params.pageIndex) {
      uri +=
        "?pageIndex=" +
        req.params.pageIndex +
        "&pageSize=" +
        req.params.pageSize;
    }
    if (req.params.stops >= 0) {
      uri += "&stops=" + req.params.stops;
    }
    unirest
      .get(uri)
      .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
      .header("X-Mashape-Host", skyscannerDomain)
      .end(function(result) {
        if (result.status >= 200 && result.status < 300) {
          return res.send(result.body);
        } else {
          console.log("ERROR:"+JSON.stringify(result.body))
          return res.status(400).send(result.body);
        }
      });
  }
);

app.get(
  SUFFIX + "getSuggestions/:country/:currency/:lang/:query/:outboundDate/:inboundDate",
  function(req, res) {

    //let coolPlaces = ["LOND-sky","MOSC-sky","NYCA-sky"];//FIXME save mongo collection of cool places
    let coolPlaces = ["LOND-sky"];
    let suggest = [];

    var uri =
      skyScannerEndPoint +
      "/autosuggest/v1.0/IT/EUR/it/?query=" +
      req.params.query;

    unirest
      .get(uri)
      .header("X-Mashape-Key", process.env.SKYSCANNERKEY)
      .header("X-Mashape-Host", skyscannerDomain)
      .end(function(result) {
        if (result.status >= 200 && result.status < 300) {

          if(result.body.Places.length == 0) {
            return res.status(400).send("No place found");
          }

          let originPlace = result.body.Places[0].PlaceId;

          let i;
          for(i = 0 ; i < coolPlaces.length ; i++) {

            unirest.get(skyScannerEndPoint + "/browsedates/v1.0/"+req.params.country+"/"+req.params.currency+"/"+req.params.lang+"/"+originPlace+"/"+coolPlaces[i]+"/"+req.params.outboundDate+"?inboundpartialdate="+req.params.inboundDate)
              .header("X-RapidAPI-Key", process.env.SKYSCANNERKEY)
              .end(function (resBrowseDates) {

                if (resBrowseDates.status >= 200 && resBrowseDates.status < 300) {
                  suggest.push(resBrowseDates.body);

                  if(i == coolPlaces.length) {
                    return res.send({data:suggest});

                  }

                } else {
                  console.log("ERROR:"+JSON.stringify(resBrowseDates.body))
                  return res.status(400).send(resBrowseDates.body);
                }
              });

          }

        } else {
          console.log("ERROR:"+JSON.stringify(result.body))
          return res.status(400).send(result.body);
        }
      });

  }
);

// application -------------------------------------------------------------
app.get("*", (req, res) => {
  res.sendFile(distDir + "/index.html"); // load the single view file (angular will handle the page changes on the front-end)
});
