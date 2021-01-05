var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

/* GET home page. */
router.get('/', function(req, res, next) {
   //查询news_table表
   db.query("SELECT * FROM news_table",[],function(results,fields){
    console.log(JSON.parse(JSON.stringify(results)),"111");
    res.render('index', { title: JSON.parse(JSON.stringify(results))});
  })
  
});

module.exports = router;



