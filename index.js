var moment = require('moment');

var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
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

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
