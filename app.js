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
var connection = new dbSQLConnection(config);
// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
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

var bookRouter = express.Router();
bookRouter.route('/BooksFromMongo')
    .post(function(req, res, next){
        // var book = new Book(req.body);
        // console.log(book);
        // res.send(book);
        console.log(req.body)
        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            read: req.body.read
        });

        book
            .save()
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
        res.status(201).json({
            message: "Handling POST requests to /Books",
            //createdBook: book
        })
    })
    .get(function(req, res){
        var responseJson = {hello: "This is my api Json"};
        Book.find({}, function(err, books){
            if(err)
                //console.log(err)
                res.status(500).send(err);
            else {
                res.json(books);
                // if(books.length == 0)
                //     res.send('0 record found.');
                // else
                //     res.send('some record found.');             
            }
                
        })
        // res.json(responseJson)
    })

bookRouter.route('/BooksFromAzureSQL')
    .post(function(req, res, next){
        // var book = new Book(req.body);
        // console.log(book);
        // res.send(book);
        console.log(req.body)
        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            read: req.body.read
        });

        book
            .save()
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
        res.status(201).json({
            message: "Handling POST requests to /Books",
            //createdBook: book
        })
    })
    .get(function(req, res){
        var responseJson = {hello: "This is my api Json"};
        var responseText = "";
        // Book.find({}, function(err, books){
        //     if(err)
        //         //console.log(err)
        //         res.status(500).send(err);
        //     else {
        //         res.json(books);
        //         // if(books.length == 0)
        //         //     res.send('0 record found.');
        //         // else
        //         //     res.send('some record found.');             
        //     }
                
        // })
        console.log('Reading rows from the Table...');

       // Read all rows from table
        var request = new dbSQLRequest(
            "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid",
                function(err, rowCount, rows) 
                    {
                        console.log(rowCount + ' row(s) returned');
                        process.exit();
                    }
                );

        request.on('row', function(columns) {
            columns.forEach(function(column) {
                console.log("%s\t%s", column.metadata.colName, column.value);
                // responseText = responseText + column.metadata.colName + "\t" + column.value + "\n";
            });
        });
        connection.execSql(request);
        // console.log(responseText)
        res.json(responseJson)
        // res.send(responseText)
    })

app.use('/api', bookRouter);

app.get('/', function(req, res){
    res.send('welcome to my API - pushed!');
})

app.listen(port, function(){
    console.log('Gulping is running my app on PORT: ' + port);
})