
exports.authorize = (req, res, next) => {
  if (req.session && req.session.auth)
    return next()
  else
    return res.send(401)
}

exports.logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return console.log(error)
    res.redirect('/')
  })
}