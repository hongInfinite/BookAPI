var express = require('express');

var routes = function(Book, dbSQLRequest, dbSQLConnection){
    var bookRouter = express.Router();

    bookRouter.use('/BooksFromMongo/:bookId', function(req, res, next) {
        Book.findById(req.params.bookId, function(err, book){
            if(err)
                res.status(500).send(err);
            else if(book)
            {
                req.book = book;
                next();
            }
            else
            {
                res.status(404).send('no book found');
            }
        });
    });

    var bookController = require('../controllers/bookController')(Book)
    bookRouter.route('/BooksFromMongo')
        .post(bookController.post)        
        // .post(function(req, res, next){
        //     // var book = new Book(req.body);
        //     // console.log(book);
        //     // res.send(book);
        //     console.log(req.body)
        //     var book = new Book({
        //         title: req.body.title,
        //         author: req.body.author,
        //         genre: req.body.genre,
        //         read: req.body.read
        //     });
    
        //     book
        //         .save()
        //         .then(result => {
        //             console.log(result);
        //         })
        //         .catch(err => console.log(err));
        //     res.status(201).json({
        //         message: "Handling POST requests to /Books",
        //         //createdBook: book
        //     })
        // })
        .get(bookController.get)
        // .get(function(req, res){
        //     var responseJson = {hello: "This is my api Json"};
        //     Book.find({}, function(err, books){
        //         if(err)
        //             //console.log(err)
        //             res.status(500).send(err);
        //         else {
        //             res.json(books);
        //             // if(books.length == 0)
        //             //     res.send('0 record found.');
        //             // els  e
        //             //     res.send('some record found.');             
        //         }
        //     })
        //     // res.json(responseJson)
        // })

    bookRouter.route('/BooksFromMongo/:bookID')
        .get(function(req, res){
            res.json(req.book);
        })  
        .put(function(req, res){
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(req.book);
            });
        })
        .patch(function(req, res){
            if(req.body._id)
                delete req.body._id;
            for(var p in req.body){
                req.book[p] = req.body[p];
            }
            req.book.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(req.book);
            });
        })
        .delete(function(req, res){
            req.book.remove(function(err){
                if(err){
                    res.status(201).json({
                        message: "Handling DELETE request to /Books have issue in ERR.",
                        //createdBook: book
                    })                    
                    // res.status(500).send(err);
                }
                else{
                    res.status(201).json({
                        message: "Handling DELETE request to /Books have issue in ELSE.",
                        //createdBook: book
                    })                    
                    // res.status(204).send('Removed');
                }
            })         
        });

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
            dbSQLConnection.execSql(request);
            // console.log(responseText)
            res.json(responseJson)
            // res.send(responseText)
        })
    return bookRouter;
};

module.exports = routes;