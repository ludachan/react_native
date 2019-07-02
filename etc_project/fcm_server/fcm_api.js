
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
let apiRoutes = require("./api-routes")
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

var db = mongoose.connection;
var port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hello fcm Express'));
app.use('/api', apiRoutes)
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});