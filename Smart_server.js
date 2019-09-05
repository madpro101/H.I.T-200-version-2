var express = require("express");
var session = require('express-session');
var path = require('path')
var bodyParser = require('body-parser');
const _ = require('lodash')
//var Cryptr = require('cryptr');
//cryptr = new Cryptr('myTotalySecretKey');
var morgan = require('morgan');
var bcrypt = require('bcrypt');


const fileUpload = require('express-fileupload');
const webPush = require('web-push');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8014;
const { mongoose } = require('./db/mongoose');
const { Student } = require('./models/student');

const {Notification} = require('./models/Notification');

const {Lecturer } = require('./models/Lecturer');
const {Course } = require('./models/Course');
const {Dept } = require('./models/Dept');
const {Event } = require('./models/Event');
const {Posts } = require('./models/Posts');
const {Timetable } = require('./models/Timetable');
const {Adminnotification} = require('./models/Adminnotifications');



app.use(session({
    name: 'sid',
    secret: 'secret',
    resave: 'false',
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true,
        secure: 'auto'
 }
}));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    const { UserId } = req.session
    var loggedIn = null
    UserId ? loggedIn = true : loggedIn = false

    res.render('index.ejs', { loggedIn });
});
app.get('/login', (req, res) => {
    res.render('login.ejs',{error:' '})
  })
  
app.get('/signup', function (req, res) {
    
    res.render('signup.ejs',{error:""});
});
app.get('/profilepic', function (req, res) {
    res.render('profpic.ejs');
});
app.post('/reg', function (req, res) {
    console.log(req.body)
    var newStudent = new Student(req.body)
    newStudent.save().then((student) => {
      req.session.UserId = student._id.toHexString()
      res.redirect('/login')
      io.emit('newreg',{message: 'New User Registered'})
    }).catch(() => {
        res.render('signup.ejs',{error:"Invalid Signup"})
      })
});
app.post('/admin_post', function (req, res) {

    var newNotification = new Notification(req.body)
    
    
    // temporary, delete this code
    newNotification
    .save()
    .then((Notifications) => {
        console.log(Notifications)
        var {Sender, Desc, Date, Ntype} = Notifications
        var notification = {
            Sender,
            Desc,
            Date,
            Ntype
        }
        io.emit('newnotification', notification)
    })
    .catch(error => console.log(error))

    res.redirect('/admin_posts')
    
});

app.post('/auth', function (req, res) {
    var body = _.pick(req.body, ['Regno','Password'])
    Student.findByCredentials(req.body.Regno, body.Password).then((student) => {
      req.session.UserId = student._id.toHexString()
      req.session.usrname=student.FullName
    res.redirect('/home')
    }).catch(() => {
      res.render('login.ejs',{error:"Account does not  exist"})
    })
});

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
});

// inserting into notifications
app.post('/send_post', function (req, res) {
   
    console.log(req.body)
    var newNotification= new Notifications(req.body)
    newNotification.save().then((Notifications) => {
     
      console.log("notification sent");
    }).catch(error => console.log(error))
});



app.get('/home', function (req, res) {
    var username= req.session.usrname
    
    Notification.find({}, (err, Notifications) => {
    // note that data is an array of objects, not a single object!
    if (err) return console.error(err);
    
    console.log(Notifications)
    res.render('home.ejs', {
        varname :username,
        print: Notifications
    });
    });
     // res.render('home.ejs', { print: data, varname: regno });
})          

global.user = null;

//var authenticateController = require('./controllers/ac');
//var registerController = require('./controllers/rc');

app.use(fileUpload());
// allow the ui to acees the css and js

const uploads = './uploads/';
const fs = require('fs');
var listOfFiles;
function getFileList() {
    fs.readdir(uploads, (err, files) => {
        if (err) { console.log(err); }
        else { listOfFiles = files; }
    });
}
//app.get('/start', function (req, res) {
//  res.render(__dirname + "/views/pages/" + "index.ejs");
getFileList();
app.get('/material', function (req, res) {
    // var data = {
    //     files: listOfFiles
    // }
   // if (req.session.loggedin) {
        getFileList();
        res.render('material.ejs', { varname: req.session.UserId, files: listOfFiles });
 //   }
   // else { res.redirect('/login'); }

});
app.use(fileUpload());
// allow the ui to acees the css and js





var listOfFiles;
function getFileList() {
    fs.readdir(uploads, (err, files) => {
        if (err) { console.log(err); }
        else { listOfFiles = files; }
    });
}
getFileList();
app.get('/admin_posts', function (req, res) {
    
    getFileList();
    res.render('Lec_posts.ejs', { usrname :"Mr Tewewe",files: listOfFiles });
//   
    
    
        // note that data is an array of objects, not a single object!
    
       // 
     //   else{ res.redirect('/Admin_login'); }
    
        
    
});

app.get('/notification', function (req, res) {
   // if (req.session.loggedin) {
    var username=req.session.loggedin;
    Notification.find({}, function(err, Notifications) {
        // note that data is an array of objects, not a single object!
        console.log(Notifications);
        console.log(req.session);
        if (req.session.UserId) {
            res.render('notification.ejs', {
                varname :req.session.usrname,
                print: Notifications
            });
           
        }
        else { res.redirect('/login'); }
      
    }); // res.render('home.ejs', { print: data, varname: regno });
 
  //  }
   // else { res.redirect('/login'); }
});

app.get('/baserooms', function (req, res) {
    console.log(req.session);
    if (req.session.UserId) {
        res.render("baserooms.ejs", { varname: req.session.usrname});
    }
    else { res.redirect('/login'); }
});

app.get('/portal', function (req, res) {
    console.log(req.session);
    if (req.session.UserId) {
        res.render("portal.ejs", { varname: req.session.usrname});
    }
    else { res.redirect('/login'); }
});


    



app.get('/download/:filename', function (req, res) {
    // console.log("downloading: " + req.params.filename)
    res.download(__dirname + "/uploads/" + req.params.filename)
})

// app.get('/file', function (req, res) {
//     res.download('uploads/index.html');
// });

app.post('/upload', function (req, res) {
    // console.log(req.files.file)
    console.log(req.body)
    var Adminnotifications = new Adminnotifications(req.body)
    newAdminnotfications.save().then((Adminnotifications) => {
      req.session.UserId = student._id.toHexString()
      
    }).catch(error => console.log(error))

    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploads+"uploads" + sampleFile.name, function (err) {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
        console.log('File uploaded!');
    });
} )
/************profilepicture uploading **************/
app.post('/profupload', fileUpload ,function (req, res) {
    console.log(req.files.file)
     if (Object.keys(req.files).length == 0) {
     return res.status(400).send('No files were uploaded.');
     }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv("profileuploads" + sampleFile.name, function (err) {
        if (err)
            return res.status(500).send(err);
        res.send('profile picture uploaded!');
        console.log('File uploaded!');
    });
}); 



// blog
//web push notification



app.get('/blog', (req, res) => {

    if (req.session.UserId) {



        res.render('Blog.ejs', { name: req.session.usrname });
    }
    else { res.redirect('/login'); }
});

app.post('/chat', (req, res) => {
    /***data ? ***/

    if (req.session.UserId) {

    const data = {
        name: req.session.name
    };
    res.render('Blog.ejs', data);
    }else{
        res.redirect('/login');
    }
    
});



/**********************************lecturer end****************************/
app.get('/my/pdf', function (req, res) {
    var doc = new Pdf();
    doc.text("Hello World", 50, 50);

    doc.output( function(pdf) {
        res.type('application/pdf');
        res.end(pdf, 'binary');
    });
});
const uploads1 = './uploads/courses';
const uploads2 = './uploads/assignments';
const uploads3 = './uploads/classes';

var listOfRegisters;
function getRegisterslists() {
    fs.readdir(uploads3, (err, files) => {
        if (err) { console.log(err); }
        else { listOfRegisters = files; }
    });
}
//app.get('/start', function (req, res) {
//  res.render(__dirname + "/views/pages/" + "index.ejs");
getRegisterslists();


var listOfCourses;
function getCourselists() {
    fs.readdir(uploads1, (err, files) => {
        if (err) { console.log(err); }
        else { listOfCourses = files; }
    });
}
var listOfCourses;
function getAssignmentlists() {
    fs.readdir(uploads1, (err, files) => {
        if (err) { console.log(err); }
        else { listOfAssignments = files; }
    });
}
//app.get('/start', function (req, res) {
//  res.render(__dirname + "/views/pages/" + "index.ejs");
getCourselists();
getAssignmentlists();

app.get('/admin_home', function(req, res) {
    res.render('Ldashboard.ejs',{courses:listOfCourses,registers:listOfRegisters,assignments:listOfAssignments})
  })
app.get('/admin_login',function (req, res)  {

    res.render('lec_login.ejs',{error:""})
  })
  
 
  app.get('/admin_settings', function(req, res) {
    if (req.session.UserId) {
        res.render('Admin_settings.ejs')}
    else{ res.redirect('/admin_login'); }
});
    



app.get('/Classrooms', function(req, res) {

   res.render('Adiminbaserooms.ejs')

});
    

app.get('/admin_signup', function (req, res) {
    res.render('lec_signup.ejs',{error:""});
});
app.post('/admin_reg', function (req, res) {
    var newLecturer = new Lecturer(req.body)
    newLecturer.save().then((lecturer) => { console.log(Lecturer)
      req.session.UserId = lecturer._id.toHexString()

     res.redirect('/admin_login')
 }).catch(() => {
       
          res.render('lec_signup.ejs',{error:"Invalid login"})
         })

    
});

app.post('/adminauth', function (req, res) {
    var body = _.pick(req.body, ['Employee_no', 'Password'])
    Lecturer.findByCredentials(body.Employee_no, body.Password).then((lecturer) => {
      req.session.UserId = lecturer._id.toHexString()
      
      req.session.usrname=lecturer.FullName
  
      res.redirect('/admin_home')
      
    }) .catch(() => { res.render('lec_login.ejs',{error:"Invalid Signup"})})
    
});
app.get('/admin_logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin_login')
});



global.user = null;


/*********** HTTP/Socket.IO Connections ***************/

io.on('connection', function (socket) {
    console.log('connected ' + socket.id); //getting socket id
    socket.on('chat', function (msg, person, user, time) {
        io.emit('chat', msg, person, user, time);
    });
    socket.on('typing', function (person, user) {
        io.emit('typing', person, user);
    });
});

io.on('disconnect', function () {
    console.log('user is disconnected!!!');
});
/*** *app.listen(8014);***/

/********** here always be http connection not app connection******/
http.listen(port, function () {
    console.log('Listening at port: ' + port);
});
