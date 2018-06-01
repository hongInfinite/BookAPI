var bookController = function(Book){
    var post = function(req, res, next){
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
        });
    }

    var get = function(req, res){
        var responseJson = {hello: "This is my api Json"};
        Book.find({}, function(err, books){
            if(err)
                //console.log(err)
                res.status(500).send(err);
            else {
                res.json(books);
                // if(books.length == 0)
                //     res.send('0 record found.');
                // els  e
                //     res.send('some record found.');             
            }
        });
        // res.json(responseJson)
    }

    return {
        post: post,
        get: get
    }
}

module.exports = bookController;