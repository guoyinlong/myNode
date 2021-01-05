var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

/* GET home page. */
router.get('/', function(req, res, next) {

  //查询news_table表
  db.query("SELECT * FROM news_table",[],function(results,fields){
    console.log(results);
    
    res.render('index', { title: 'Express,index' });
  })
  
});

module.exports = router;