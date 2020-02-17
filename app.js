const express = require('express')
const cors = require('cors')
const mongoskin = require('mongoskin')
const bodyParser = require('body-parser')
const logger = require('morgan')
const http = require('http')


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(logger())
app.set('port', process.env.PORT || 3000)

const db = mongoskin.db('mongodb://@localhost:27017/blog');
const id = mongoskin.helper.toObjectID;

app.param('collectionName', (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/', (req, res, next) => {
  res.send('/collections/messages')
})

app.get('/collections/:collectionName', (req, res, next) => {
  req.collection.find({}, {limit: 10, sort: [['_id', -1]]})
    .toArray((e, results) => {
      if (e) return next(e)
      res.send({body:results,code:1})
    }
  )
})

app.post('/collections/:collectionName', (req, res, next) => {
  // TODO: Validate req.body
  req.collection.insert(req.body, {}, (e, results) => {
    if (e) return next(e)
    res.send({body:results,code:1})
  })
})

app.get('/collections/:collectionName/:id', (req, res, next) => {
  req.collection.findOne({_id: id(req.params.id)}, (e, result) => {
    if (e) return next(e)
    res.send({body:result,code:1})
  })
})

app.put('/collections/:collectionName/:id', (req, res, next) => {
  req.collection.update({_id: id(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false}, (e, result) => {
      if (e) return next(e)
      res.send((result.result.n === 1) ? {msg: 'success',code:1} : {msg: 'error',code:0})
    })
})

app.delete('/collections/:collectionName/:id', (req, res, next) => {
  req.collection.remove({_id: id(req.params.id)}, (e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ? {msg: 'success',code:1} : {msg: 'error',code:0})
  })
})

const server = http.createServer(app)
const boot = () => {
  server.listen(app.get('port'), () => {
    console.info(`Express server listening 
      on port ${app.get('port')}`)
  })
}

const shutdown = () => {
  server.close(process.exit)
}

if (require.main === module) {
  boot()
} else {
  console.info('Running app as a module')
  exports.boot = boot
  exports.shutdown = shutdown
  exports.port = app.get('port')
}