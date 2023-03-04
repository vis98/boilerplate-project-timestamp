require('dotenv').config();
const express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var dns = require("dns");
const cors = require('cors');
const validUrl = require('valid-url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we're connected!");
});

//Schema n Model
var urlSchema = new mongoose.Schema({
  id: Number,
  url: String
});

var urlModel = mongoose.model("urls", urlSchema);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

const { type } = require('express/lib/response');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date", function (req, res) {

   /*if (moment.utc(date, 'YYYY-M-D', true).isValid() || moment.utc(date, 'YYYY-M-D', true).isValid()) {
    res.json({
      unix: new Date(date).getTime(),
      utc: new Date(date).toUTCString()
    });
  }
  else if (new Date(date)!="Invalid Date") {
    res.json({
      unix: new Date(date).getTime(),
      utc: new Date(date).toUTCString()
    });
  }
  else if (!isNaN(date)) {
    res.json({
      unix: new Date(parseInt(date)).getTime(),
      utc: new Date(parseInt(date)).toUTCString()
    });
  }
  else {
    res.send({"error":"Invalid Date"});
  }*/
  const dateString=req.params.date;
  let date;
  if(!dateString){
    date=new Date();
  }
  else{
    if(!isNaN(dateString)){
      date=new Date(parseInt(dateString));
    }
    else{
      date=new Date(dateString);
    }
  }
  if(date.toString()=='Invalid Date'){
    res.json({error: date.toString()});
  }
  else{
    res.json({unix: date.getTime(),utc:date.toUTCString()});
  }
  
});



app.get("/api", (req, res)=>{
  let date = new Date();
  
  return res.json({
    'unix': date.getTime(), 
    'utc': date.toUTCString()
  });  
});


//2nd assignment of request header parsing
app.get('/api/whoami', function(req, res) {
  res.json({ ipaddress: ip.address(), language: req.headers["accept-language"], software: req.headers["user-agent"] });
});

//3rd assignment

app.post('/api/shorturl', async function(req, res) {
  let input_url = req.body.url;
  if (!validUrl.isHttpsUri(input_url) || !validUrl.isWebUri(input_url)) {
    res.json({ "error": 'invalid url' });
  }
  else {
    let record = await urlModel.findOne({
      url: input_url
    });
    if (record) {
      res.json({
        original_url: record.url,
        short_url: record.id
      });
    }
    else {
      let query = await urlModel.countDocuments({}).exec();
      let count = query + 1;
      findOne = new urlModel({
        id: count,
        url: input_url
      });
      await findOne.save();
      res.json({
        original_url: findOne.url,
        short_url: findOne.id
      });
    }
  }
});



app.get('/api/shorturl/:id', async function(req, res) {
  try {
    const urlParams = await urlModel.findOne({
      id: req.params.id
    })
    if (urlParams) {
      return res.redirect(urlParams.url)
    } else {
      return res.status(404).json('No URL found')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json('Server error')
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
