const express = require('express')
const cors = require('cors')
const mongoskin = require('mongoskin')
const bodyParser = require('body-parser')
const logger = require('morgan')
const http = require('http')
const user  = require('./user');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true 
}))
app.use(bodyParser.json())
app.use(logger())
app.use(cookieParser('3C4ACD-6ED1-4844-9217-8213177BD239'))
app.use(session({secret: '2C44774A-D6GG-4D44-9535-46E244EF984F', cookie: { maxAge: 600000 }}))

app.set('port', process.env.PORT || 3000)

const db = mongoskin.db('mongodb://@localhost:27017/blog');
const id = mongoskin.helper.toObjectID;

const authenticate = (req, res, next) => {
  if (!req.body.username || !req.body.password)
    return next({error: 'Please enter your username and password.'})
    req.collection = db.collection('users')
    req.collection.findOne({
        username: req.body.username,
        password: req.body.password
     }, (error, user) => {
        if (error) return next(error)
        if (!user) return next({error: 'Incorrect username&password combination.'})
        req.session.auth = true;
        // req.session.user = user
        // req.session.admin = user.admin
        return res.send({code:1})

  })
}

app.param('collectionName', (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/', (req, res, next) => {
  res.send('/collections/messages')
})

app.post('/login', authenticate)

// app.all('/collections', user.authorize)

app.get('/collections/:collectionName', user.authorize, (req, res, next) => {
  req.collection.find({}, {limit: 10, sort: [['_id', -1]]})
    .toArray((e, results) => {
      console.log('req.session:')
      console.log(req.session.auth)

      if(req.session && req.session.auth) {
        if (e) return next(e)
        res.send({body:results,code:1})
      } else {
        return res.send(401)
      }
    }
  )
})

app.post('/collections/:collectionName', user.authorize, (req, res, next) => {
  // TODO: Validate req.body
  req.collection.insert(req.body, {}, (e, results) => {
    if (e) return next(e)
    res.send({body:results,code:1})
  })
})

app.get('/collections/:collectionName/:id', user.authorize, (req, res, next) => {
  req.collection.findOne({_id: id(req.params.id)}, (e, result) => {
    if (e) return next(e)
    res.send({body:result,code:1})
  })
})

app.put('/collections/:collectionName/:id', user.authorize, (req, res, next) => {
  req.collection.update({_id: id(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false}, (e, result) => {
      if (e) return next(e)
      res.send((result.result.n === 1) ? {msg: 'success',code:1} : {msg: 'error',code:0})
    })
})

app.delete('/collections/:collectionName/:id', user.authorize, (req, res, next) => {
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