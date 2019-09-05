const redirectLogIn = (req,res,next) => {
  if(!req.session.UserId) {
    res.redirect('/login')
  } else {
    next()
  }
}

module.exports = {redirectLogIn}