var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

//var db = mongoose.connect('mongodb://localhost/bookAPI');
var db = mongoose.connect('mongodb+srv://sa:sa001@webdev-rd6vq.mongodb.net/test?retryWrites=true', {
    //useMongoClient: true
})

var Book = require('./models/bookModel');
var app = express();
var port = process.env.port || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var bookRouter = express.Router();
bookRouter.route('/Books')
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

app.use('/api', bookRouter);

app.get('/', function(req, res){
    res.send('welcome to my API - pushed!');
})

app.listen(port, function(){
    console.log('Gulping is running my app on PORT: ' + port);
})