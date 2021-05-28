//The nodejs file and express routings have been adapter from the CS230 Assignment 6 demo and modified using adapted routing logic from Assignment 4
//Having worked on this for 15 hours I did not have time for extensive commenting, however I haven't used anything found outside of my CS230 previous assignments or notes
//I would like to have tidied up the Nodejs file and used more appropriate console.log information in the console, however everything does work as it should
//Please check tables from the front end before using Delete or Update on any of the collections, as these functions are hardcoded and can only be tested once without
//reverting them to their previous state within mongodb
//The hardcoded changes for Delete and Update are shown in the UI


// Load the NodeJS modules required (ExpressJS)
var express = require("express"); // using ExpressJS package
var bodyParser = require("body-parser"); // using body-parser for parsing!

var app = express(); // create the ExpressJS server app

// parse JSON and URL Encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8000; // port the server app with listen on

// watch for Ctrl-C and then close database connection!
process.on("SIGINT", function () {
    console.log("\nDatabase (AjaxAPIDemo): Disconnected!\n");
    process.exit();
});

//
// Setup up the MongoDB connection - note that this sets up a variable
// client which is used to make connections, etc. The connection code
// was generated and copied from the MongoDB Atlas Cluster ("Connect"
// botton). You need to have already set this up and have created a
// user and database callec "test". My user is called Admin user.
// I have created a collection called "AjaxAPIDemo" that will hold the data.
//

const MongoClient = require("mongodb").MongoClient;
const uri =
    "mongodb+srv://Emmett09:rE@ES5gQ86pyCn-@cluster0.gdntj.mongodb.net/assignment05?retryWrites=true&w=majority";

//
// This section manages a collection-based (mogodb) database connection
// This Demo services the routes using ExpressJS. Notice that with MongoDB
// we organise the app by setting up the connection and issue the ExpressJS
// commands "inside" the callback function. When we worked with MySQL the
// database setup code was outside and before ExpressJS services.
//

MongoClient.connect(uri, { useUnifiedTopology: true })
    .then((client) => {
        // connect to the collection used by the app
        const collection = client.db("24test").collection("Client");
        const therapist_collection = client.db("24test").collection("Physiotherapist");
        const session_collection = client.db("24test").collection("Session");
        console.log("Database (AjaxAPIDemo): Connected!\n");
        //
        // If no API call made then the default route is / so
        // just return the default index.html file to the user.
        // This contains the forms, etc. for making the CRUD
        // requests (only Create and Retrieve implemented)
        //
        app.get("/", function (req, res) {
            res.sendFile(__dirname + "/test.html");
        });

        //
        // Handle the requests from client made using the route /api/user
        // These come via AJAX embedded in the earlier served index.html
        // There will be a single route (/api/user) but two HTTP request methods
        // POST (for Create) and GET (for Retrieve). We use app.get() and app.post()
        // to handle the route services. Notice there is much less code involved
        // than in the earlier example thanks to ExpressJS.
        //

        // Handle a GET request;  the user is requesting user data via AJAX!
        // This is the CRUD (R)etrieve request. These data need to be
        // extracted from the database and returned to the user as JSON!
        app.get("/api/user", function (req, res) {
            // make the database query using the connection created earlier
            collection
                .find()
                .toArray()
                .then((results) => {
                    console.log(
                        "USER DATABASE REQUESTED: \n\n" +
                        JSON.stringify(results, null, 2) +
                        "\n"
                    );
                    res.json(results); // return unprocessed result from MongoDB "find" Query
                })
                .catch((error) => console.error(error));
        });

        // Handle a POST request;  the user is sending user data via AJAX!
        // This is the CRUD (C)reate request. These data need to be
        // extracted from the POST request and saved to the database!
        app.post("/api/user", function (req, res) {
            var userData = req.body;
            console.log(
                "USER DATA RECEIVED: \n\n" + JSON.stringify(userData, null, 2) + "\n"
            );
            // we have the data supplied so make the database connection and
            // the (unvalidated) data. Without validation we just hope everything
            // works out okay - for production we would need to perform validation
            collection
                .insertOne(userData)
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => console.error(error));
            console.log(
                `USER RECORD INSERTED: ['${userData.title}','${userData.firstname}','${userData.surname}','${userData.mobile}','${userData.homephone}','${userData.email}']\n`
            );
            // respond to the user with confirmation message
            res.send(
                "User (" +
                userData.firstname +
                " " +
                userData.surname +
                ") data added to the Database!"
            );
        });

        app.delete("/api/deleteUser", function(req, res){
            console.log("Delete function");
            var myquery = {firstname: "Danny", surname: "Deleto"};
            collection.deleteOne(myquery, function (err, obj) {
                if (err) throw err;
                console.log("The recently created user was deleted");
            });
    });

        app.post("/api/updateUser", function(req, res){
        console.log("string");
            var myquery = {firstname: "Emmett", surname: "Mulroy"};
            var newvalues = {$set: {firstname: "Rick", surname: "Marshall"}};
            collection.updateOne(myquery, newvalues, function (err, obj) {
                if (err) throw err;
                console.log("User updated");
            });
        });

        //Start of Physiotherapist CRUD###########################################################################################
        app.get("/api/therapist", function (req, res) {
            // make the database query using the connection created earlier
            therapist_collection
                .find()
                .toArray()
                .then((results) => {
                    console.log(
                        "Therapist DATABASE REQUESTED: \n\n" +
                        JSON.stringify(results, null, 2) +
                        "\n"
                    );
                    res.json(results); // return unprocessed result from MongoDB "find" Query
                })
                .catch((error) => console.error(error));
        });

        // Handle a POST request;  the user is sending user data via AJAX!
        // This is the CRUD (C)reate request. These data need to be
        // extracted from the POST request and saved to the database!
        app.post("/api/therapist", function (req, res) {
            var userData = req.body;
            console.log(
                "Therapist DATA RECEIVED: \n\n" + JSON.stringify(userData, null, 2) + "\n"
            );
            // we have the data supplied so make the database connection and
            // the (unvalidated) data. Without validation we just hope everything
            // works out okay - for production we would need to perform validation
            therapist_collection
                .insertOne(userData)
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => console.error(error));
            console.log(
                `Therapist RECORD INSERTED: ['${userData.t_title}','${userData.t_firstname}','${userData.t_surname}','${userData.t_mobile}','${userData.t_homephone}','${userData.t_email}']\n`
            );
            // respond to the user with confirmation message
            res.send(
                "User (" +
                userData.t_firstname +
                " " +
                userData.t_surname +
                ") data added to the Database!"
            );
        });

        app.delete("/api/deleteTherapist", function(req, res){
            console.log("Delete function");
            var myquery = {t_firstname: "Dee", t_surname: "Leteme"};
            therapist_collection.deleteOne(myquery, function (err, obj) {
                if (err) throw err;
                console.log("The specified therapist was deleted");
            });
        });

        app.post("/api/updateTherapist", function(req, res){
            console.log("string");
            var myquery = {t_firstname: "Grace", t_surname: "Kelly"};
            var newvalues = {$set: {t_firstname: "Stu", t_surname: "Pickles"}};
            therapist_collection.updateOne(myquery, newvalues, function (err, obj) {
                if (err) throw err;
                console.log("Therapist updated");
            });
        });

        //Start of Physiotherapy session CRUD###########################################################################################
        app.get("/api/session", function (req, res) {
            // make the database query using the connection created earlier
            session_collection
                .find()
                .toArray()
                .then((results) => {
                    console.log(
                        "Session DATABASE REQUESTED: \n\n" +
                        JSON.stringify(results, null, 2) +
                        "\n"
                    );
                    res.json(results); // return unprocessed result from MongoDB "find" Query
                })
                .catch((error) => console.error(error));
        });

        // Handle a POST request;  the user is sending user data via AJAX!
        // This is the CRUD (C)reate request. These data need to be
        // extracted from the POST request and saved to the database!
        app.post("/api/session", function (req, res) {
            var userData = req.body;
            console.log(
                "Session DATA RECEIVED: \n\n" + JSON.stringify(userData, null, 2) + "\n"
            );
            // we have the data supplied so make the database connection and
            // the (unvalidated) data. Without validation we just hope everything
            // works out okay - for production we would need to perform validation
            session_collection
                .insertOne(userData)
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => console.error(error));
            console.log(
                `Session RECORD INSERTED: ['${userData.s_date}','${userData.s_time}','${userData.s_client}','${userData.s_therapist}','${userData.s_fee}','${userData.s_number}']\n`
            );
            // respond to the user with confirmation message
            res.send(
                "User (" +
                userData.s_date +
                " " +
                userData.s_time +
                ") data added to the Database!"
            );
        });

        app.delete("/api/deleteSession", function(req, res){
            console.log("Delete function");
            var myquery = {s_client: "Danny Deleto", s_date: "21/05/2021"};
            session_collection.deleteOne(myquery, function (err, obj) {
                if (err) throw err;
                console.log("The specified session was deleted");
            });
        });

        app.post("/api/updateSession", function(req, res){
            console.log("string");
            var myquery = {s_client: "Emmett Mulroy", s_date: "21/05/2021"};
            var newvalues = {$set: {s_client: "Jill Mulroy", s_date: "21/05/2021"}};
            session_collection.updateOne(myquery, newvalues, function (err, obj) {
                if (err) throw err;
                console.log("Session updated");
            });
        });

        // Set up the HTTP server and listen on port 8000
        app.listen(port, function () {
            console.log("\nAJAX - API - Database Demo");
            console.log("CS230 Demo Program - John G. Keating\n(c) 2021\n");
            console.log("AJAX (HTTP) API server running on port: " + port + "\n");
        });
    })
    .catch(console.error);

//I have used mongodb over mySQL due to the benefits of neater data arrangement. Mongo has allowed me to nest objects within my objects, allowing for fields such as
//Home Address and Additional Details, without the collections becoming too large or messy
//I have used 3 collections within my database, one for Clients, one for Physiotherapists, and one for Sessions
//The last of the 3 uses Clients and Therapists from the prior 2
//The routing was quite easy with Express, and displaying the nested objects was not too complicated.
//This has been tested using Google Chrome Version 90.0.4430.212 (Official Build) (64-bit) and works perfectly there using Windows 10