var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    tedious = require('tedious');

//var db = mongoose.connect('mongodb://localhost/bookAPI');
var dbMongo = mongoose.connect('mongodb+srv://sa:sa001@webdev-rd6vq.mongodb.net/test?retryWrites=true', {
    //useMongoClient: true
})

var app = express();
var port = process.env.port || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// For Mongo DB.
var Book = require('./models/bookModel');
// For Azure SQL SB.
var dbSQLConnection = tedious.Connection
var dbSQLRequest = tedious.Request
var config = 
   {
     userName: 'hongni', // update me
     password: '12qw34ER', // update me
     server: 'hongni.database.windows.net', // update me
     options: 
        {
           database: 'BookAPI' //update me
           , encrypt: true
        }
   }
var dbSQLConnection = new dbSQLConnection(config);
// Attempt to connect and execute queries if dbSQLConnection goes through
dbSQLConnection.on('connect', function(err) 
   {
     if (err) 
       {
            console.log(err)
       }
    else
       {
            console.log('Azure SQL DB Connected.')
            //queryDatabase()
       }
   }
 );

bookRouter = require('./routes/bookRoutes')(Book, dbSQLRequest, dbSQLConnection);

app.use('/api', bookRouter);

app.get('/', function(req, res){
    res.send('welcome to my API - pushed!');
})

app.listen(port, function(){
    console.log('Gulping is running my app on PORT: ' + port);
})