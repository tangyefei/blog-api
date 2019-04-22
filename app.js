const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8000
const token = 'PLACE-TOKEN-DEFINED-HERE-CHANGE-IT-MANNUALLY-ON-SERVER';

console.error('please read token from local env rather hard code!')

var mysql  = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'abcd1234_',
  database : 'blog'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... nn");    
  } else {
      console.log("Error connecting database ... nn" + err);    
  }
});

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/articles', (req, res) => {
  var sql = 'SELECT id, type, title, created_at, tags, overview from articles';
  if(req.query && req.query.type) {
    sql += ' where type = "' + req.query.type + '"';
  }
  console.log(sql)
  connection.query(sql, function(err, rows, fields) {
    let result = JSON.parse(JSON.stringify(rows))
    let resp = {code: 1, body: result}
    if (!err)
      res.json(resp);
    else
      console.log('Error while performing Query.');
    });
})


app.get('/article/:id', (req, res) => {
  connection.query('SELECT * from articles where id = ' + req.params.id, function(err, rows, fields) {
    let result = JSON.parse(JSON.stringify(rows))
    if (!err && result.length > 0)
      res.json({code: 1, body: result[0]});
    else
      console.log('Error while performing Query.');
    });
})

app.post('/article', (req, res) => {
  var d  = req.body;

  if(d.token !== token) {
    res.json({code:0,body:{msg:"无权限操作"}});
    return;
  } else if(d.id) {
    q = ['UPDATE articles SET type= ?, title= ?, created_at= ?, tags= ?, overview= ?, content=? WHERE id= ?', [d.type, d.title, d.created_at, d.tags, d.overview, d.content, d.id]]
  } else {
    q = ['INSERT INTO articles(type, title, created_at, tags, overview, content) VALUES ("' + d.type + '", "' + d.title + '", "' + d.created_at + '", "' + d.tags + '", "' + d.overview + '", "' + d.content + '")'];
  }
  connection.query(...q, function(err, rows, fields) {
    if (!err) 
      res.json({code:1,body:1});
    else {
      console.log('Error while performing Query.');
    }
    });
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
