// includerea bibliotecilor pentru extinderea 
// modulară a funcționalității engine-ului NodeJS
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

// realizarea conexiunii la baza de date
mongoose.connect("mongodb://localhost/smartschools").then(
    () => {
        console.log('Connected to mongodb')
    },
    err => {
        console.log(err);
    }
);

// schema de baza pentru liceu
var schema = new mongoose.Schema({
    name: 'string',
    description: 'string',
    img: 'string',
    url: 'string',
    departments: 'array'
});

// model facut pe baza schemei
var school = mongoose.model('HighSchool', schema);

// folderul cu resurse
app.use('/lib', express.static('lib'));

// inițializare middleware pentru preluare parametrii POST din request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// afisarea paginii principale
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/index.html');
});

// returnarea informațiilor - API
app.get('/list', function (req, res) {
    school.find({}, function (err, results) {
        res.send(results);
    });
});

// adaugarea review
app.post('/addReview', function (req, res) {
    var schoolid = req.body.id,
        dept = req.body.dept,
        name = req.body.userName,
        type = req.body.userType,
        text = req.body.content,
        build = "departments." + dept + ".reviews"; // pentru crearea etichetei json
    console.log(dept);
    school.update({ // filtrează școli după ID
            "_id": schoolid
        }, { // adaugă în array
            "$push": {
                [build]: // nume variabil json, creat după indexul respectivului departament
                {
                    "name": name,
                    "type": type,
                    "content": text,
                    "time": Date.now()
                }
            }
        },
        function (err, raw) {
            if (err) {
                res.send(err); // răspunsul în cazul unei erori
                console.log('Error while adding')
            }
            res.send(raw); // răspuns
            io.emit('update', {
                for: 'everyone'
            }); // emite informare actualizare
            console.log('Added review');
        }
    )


});

// acceptă clienți pe socket pentru informarea în momentul actualizării
io.on('connection', function (socket) {
    console.log('a user connected');
});

server.listen(3000, function () {
    console.log('App listening on port 3000');
});
