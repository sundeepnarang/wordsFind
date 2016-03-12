var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render("index",{"title":"Word Up Guess"})
});


router.post('/', function(req, res, next) {
  var word = req.query.word;
  var prefix = req.query.prefix;
  var firstClueLength = parseInt(req.query.clueLen);
  if(!firstClueLength||isNaN(firstClueLength)){
    firstClueLength=5;
  }
  if(!word){
    return res.send(404);
  } else {
    word = word.toLowerCase();
  }
  request({
    url:"http://www.wordfinders.com/solver/"
    , method:"POST"
    , form:{
      words:word,
      prefix: prefix,
      suffix:""
    }
  },function(err,response,body){
    var $ = cheerio.load(body);

    var length = firstClueLength;
    var aPath = "li.defLink a";

    var start = prefix;

    var words = $(aPath).map(function(i,d){
      return $(d).text()
    }).toArray();

    var a = words.filter(function(d){
      return d.length==length
    });

    var w = word;

    var m  = [
      [w[0],w[1],w[2]]
      ,[w[3],w[4],w[5]]
      ,[w[6],w[7],w[8]]
    ];

    var probable2s = [

      //corners

      m[0][0]+m[0][2],
      m[0][0]+m[1][2],
      m[0][0]+m[2][2],
      m[0][0]+m[2][0],
      m[0][0]+m[2][1],

      m[0][2]+m[0][0],
      m[0][2]+m[1][0],
      m[0][2]+m[2][0],
      m[0][2]+m[2][1],
      m[0][2]+m[2][2],

      m[2][2]+m[0][0],
      m[2][2]+m[0][1],
      m[2][2]+m[0][2],
      m[2][2]+m[2][0],
      m[2][2]+m[1][0],

      m[2][0]+m[0][0],
      m[2][0]+m[0][1],
      m[2][0]+m[0][2],
      m[2][0]+m[2][2],
      m[2][0]+m[1][2],

      //edges

      m[0][1]+m[2][0],
      m[0][1]+m[2][1],
      m[0][1]+m[2][2],

      m[1][2]+m[0][0],
      m[1][2]+m[1][0],
      m[1][2]+m[2][0],

      m[1][0]+m[0][2],
      m[1][0]+m[1][2],
      m[1][0]+m[2][2],

      m[2][1]+m[0][0],
      m[2][1]+m[0][1],
      m[2][1]+m[0][2]
    ];

    var unProbable2s = [

      //corners

      m[0][0]+m[0][1],
      m[0][0]+m[1][1],
      m[0][0]+m[1][0],

      m[0][2]+m[0][1],
      m[0][2]+m[1][1],
      m[0][2]+m[1][2],

      m[2][2]+m[2][1],
      m[2][2]+m[1][1],
      m[2][2]+m[1][2],

      m[2][0]+m[1][0],
      m[2][0]+m[1][1],
      m[2][0]+m[2][1],

      //edges

      m[0][1]+m[0][0],
      m[0][1]+m[1][0],
      m[0][1]+m[1][1],
      m[0][1]+m[1][2],
      m[0][1]+m[0][2],

      m[1][2]+m[0][2],
      m[1][2]+m[0][1],
      m[1][2]+m[1][1],
      m[1][2]+m[2][1],
      m[1][2]+m[2][2],

      m[2][1]+m[2][0],
      m[2][1]+m[1][0],
      m[2][1]+m[1][1],
      m[2][1]+m[1][2],
      m[2][1]+m[2][2],

      m[1][0]+m[0][0],
      m[1][0]+m[0][1],
      m[1][0]+m[1][1],
      m[1][0]+m[2][1],
      m[1][0]+m[2][0]

    ];

    var twoPairs = probable2s;

    unProbable2s.forEach(function(d){
      var index = twoPairs.indexOf(d);
      while(index>=0){
        twoPairs.splice(index,1);
        index = twoPairs.indexOf(d);
      }
      index = twoPairs.indexOf(d[1]+d[0]);
      while(index>=0){
        twoPairs.splice(index,1);
        index = twoPairs.indexOf(d[1]+d[0]);
      }
    });

    var twoPairsRev = [];

    twoPairs.forEach(function(d){
      twoPairsRev.push(d[1]+d[0]);
    });


    twoPairs.forEach(function(e){
      a = a.filter(function(d){return d.indexOf(e)==-1});
    });

    twoPairsRev.forEach(function(e){
      a = a.filter(function(d){return d.indexOf(e)==-1});
    });

    if(start) {
      a = a.filter(function(d){return d[0]==start});
    }

    console.log(a);

    res.send(a);
  });
});

module.exports = router;
