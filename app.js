const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors');
const port = 8000
const token = 'ff66068808mm';

console.error('please read token from local env rather hard code!')

var mysql  = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  insecureAuth: true,
  password : 'Msw2tuwant.',
  database : 'blog'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... nn");    
  } else {
      throw new Error(err);
  }
});

app.use(bodyParser.json())
app.use(cors())

app.post('/manage/article/del', (req, res, next) => {
  var d  = req.body;
  connection.query('DELETE FROM articles WHERE id = "' + d.id + '"', function (err) {
    if (!err)
      res.json({code:1});
    else
      next(err);
  })
});

app.get('/articles', (req, res, next) => {
  var sql = 'SELECT id, type, title, created_at, tags, overview from articles orde ORDER BY created_at DESC';
  if(req.query && req.query.type) {
    sql += ' where type = "' + req.query.type + '"';
  }
  console.log(sql)
  connection.query(sql, function(err, rows, fields) {
    let result = JSON.parse(JSON.stringify(rows))
    let resp = {code: 1, body: result}
    if (!err)
      res.send(resp);
    else
      next(err);
    });
})


app.get('/article/:id', (req, res, next) => {
  connection.query('SELECT * from articles where id = ' + req.params.id, function(err, rows, fields) {
    let result = JSON.parse(JSON.stringify(rows))
    if (!err && result.length > 0)
      res.json({code: 1, body: result[0]});
    else
    next(err);
    });
})

app.post('/article', (req, res, next) => {
  var d  = req.body;

  if(d.token !== token) {
    res.json({code:0,body:{msg:"无权限操作"}});
    return;
  } else if(d.id) {
    q = ['UPDATE articles SET type= ?, title= ?, created_at= ?, tags= ?, overview= ?, content=? WHERE id= ?', [d.type, d.title, d.created_at, d.tags, d.overview, d.content, d.id]]
  } else {
    q = ['INSERT INTO articles(type, title, created_at, tags, overview, content) VALUES (?, ?, ?, ?, ?, ?)', [d.type, d.title, d.created_at, d.tags, d.overview, d.content]];
  }
  console.log([0]);
  connection.query(...q, function(err, rows, fields) {
    if (!err) {
      console.log({code:1,body: d.id || rows.insertId});
      res.json({code:1,body: d.id || rows.insertId});
    }
    else {
      next(err);
    }
    });
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
