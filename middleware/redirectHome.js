const redirectHome = (req,res,next) => {
  if(req.session.UserId) {
    res.redirect('/home')
  } else {
    next()
  }
}

module.exports = {redirectHome}