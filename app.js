var express = require('express');

var app = express()
var port = process.env.port || 3000;

var bookRouter = express.Router();
bookRouter.route('/Books')
    .get(function(req, res){
        var responseJson = {hello: "This is my api Json"};

        res.json(responseJson)
    })

app.use('/api', bookRouter);

app.get('/', function(req, res){
    res.send('welcome to my API!');
})

app.listen(port, function(){
    console.log('Gulping is running my app on PORTddd: ' + port);
})