const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require('express-session'); // Declare session 
const qr = require('qr-image');
const fs = require('fs');

const methodOverride = require("method-override");
const logger = require('./logger');

const port = 5500;

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const users = [];

app.use(session({
  secret: 'xvbrx',
  resave: false,
  saveUninitialized: false
}));

// ... other middleware and configurations ...


app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize()) 
app.use(passport.session())
app.use(methodOverride("_method"))

// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

// Configuring the register post functionality
// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
          id: Date.now().toString(), 
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
      });

      // Log user registration data
      logger.info(`User registered: ${JSON.stringify({
          id: req.body.id,
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword, // Always hash passwords before logging!
      })}`);

      console.log(users); // Display newly registered in the console
      res.redirect("/login");
  } catch (e) {
      console.log(e);
      res.redirect("/register");
  }
});

// Routes
// app.get('/', checkAuthenticated, (req, res) => {
//     res.render("index.ejs", {name: req.user.name})
// })

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})


app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    next()
}


///////////////////////////////////////////////////////////////////
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/login', (req, res) => {
  // Assuming user is retrieved from the database based on the provided email and password
  const user = findUserByEmailAndPassword(req.body.email, req.body.password);

  // Set the user information in the session
  req.session.user = user;

  // Redirect or respond as needed
});



app.get('/myprofile', (req, res) => {
  // Get the user object from the session
  const user = req.session.user;

  // Render the myprofile page and pass the user object
  res.render('myprofile', { user: user });
});


app.get('/explore', (req, res) => {
  res.render('explore', { message: 'explore, Jee This is My explore!' });
});

app.get('/learn', (req, res) => {
  res.render('learn', { message: '' });
});

app.get('/attendence', (req, res) => {
  res.render('attendence', { message: 'This is attendence Panel!' });
});


app.get('/zone', (req, res) => {
  res.render('zone', { message: 'This is ZONE Panel!' });
});


app.get('/leaderboard', (req, res) => {
  res.render('leaderboard', { message: 'This is ZONE Panel!' });
});

app.get('/notification', (req, res) => {
  res.render('notification', { message: 'This is Notification Panel!' });
});

app.get('/coin', (req, res) => {
  res.render('coin', { message: '' });
});

app.get('/trending', (req, res) => {
  res.render('trending', { message: '' });
});

app.get('/today', (req, res) => {
  res.render('today', { message: '' });
});

app.get('/jobvacancy', (req, res) => {
  res.render('jobvacancy', { message: '' });
});

app.get('/edunews', (req, res) => {
  res.render('edunews', { message: '' });
});

app.get('/tipstricks', (req, res) => {
  res.render('tipstricks', { message: '' });
});

app.get('/zonesurvivors', (req, res) => {
  res.render('zonesurvivors', { message: '' });
});

app.get('/newupdates', (req, res) => {
  res.render('newupdates', { message: '' });
});

app.get('/registration', (req, res) => {
  res.render('partials/advance-signup', { message: 'This is Registration Panel!' });
});

// Route for Subscriber 1
app.get('/subscriber1', (req, res) => {
  res.render('subscriber/subscriber1', { pageTitle: 'Subscriber 1' });
});

// teaches
app.get('/hariom', (req, res) => {
  res.render('teachers/hariom-kumar/hariom', { pageTitle: "Hariom Kumar's Page" });
});

app.get('/arjun', (req, res) => {
  res.render('teachers/arjun-kumar/arjun', { pageTitle: "Arjun Kumar, Page" });
});

app.get('/vikash', (req, res) => {
  res.render('teachers/vikash', { pageTitle: "Vikash Kumar, Page" });
});

app.get('/nagendra', (req, res) => {
  res.render('teachers/nagendra', { pageTitle: "Nagendra Kumar, Page" });
});

app.get('/chhathu', (req, res) => {
  res.render('teachers/chhathu', { pageTitle: "Chhathu Kumar, Page" });
});

app.get('/ranjeet', (req, res) => {
  res.render('teachers/ranjeet', { pageTitle: "Ranjeet Kumar, Page" });
});

app.get('/shyam', (req, res) => {
  res.render('teachers/shyam', { pageTitle: "Shyam Kumar, Page" });
});

app.get('/pappu', (req, res) => {
  res.render('teachers/pappu', { pageTitle: "Vikash Kumar, Page" });
});

app.get('/manish', (req, res) => {
  res.render('teachers/manish', { pageTitle: "Manish Kumar, Page" });
});

app.get('/pawan', (req, res) => {
  res.render('teachers/pawan', { pageTitle: "Pawan Kumar, Page" });
});

app.get('/shani', (req, res) => {
  res.render('teachers/shani', { pageTitle: "Shani Kumar, Page" });
});

// Teachers Page ended


// Route for Parents page
app.get('/parents', (req, res) => {
  res.render('parents/dashrath-bin/dashrath-bin', { pageTitle: "D.B. Page" });
});


// Routes for guest profiles
app.get('/guest1', (req, res) => {
  res.render('guests/guest1/guest1', { message: 'Hello, Guest 1!' });
});

app.get('/guest2', (req, res) => {
  res.render('guests/guest2/guest2', { message: 'Hello, Guest 2!' });
});

// QR Code Scan System Applying CHATGPT


// app.post('/scan', (req, res) => {
//   const qrData = req.body.qrData;
//   const qrCode = qr.image(qrData, { type: 'png' });
//   const fileStream = fs.createWriteStream('attendance_data.txt', { flags: 'a' });

//   qrCode.pipe(fileStream);
//   fileStream.on('finish', () => {
//       console.log('QR code data saved to attendance_data.txt');
//       res.send('Attendance marked successfully!');
//   });
// });

// 1st failde esme PNG SAVE ho rha tha jab ki muje sirf ID chahiye tha

// Function to get current time and date
function getCurrentTimeAndDate() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const date = now.toLocaleDateString('en-US');
  return `${hours}:${minutes}:${seconds} , ${date}`;
}

app.post('/scan', (req, res) => {
  const qrData = req.body.qrData;
  const currentTimeAndDate = getCurrentTimeAndDate();

  const fileStream = fs.createWriteStream('attendance_data.txt', { flags: 'a' });
  fileStream.write(`${qrData} - ${currentTimeAndDate}\n`); // Write QR code data and time/date to file
  fileStream.end();

  console.log('QR code data saved to attendance_data.txt');
  res.send('Attendance marked successfully!');
});

// Level UPing

app.get('/attendance', (req, res) => {
  res.render('attendance');
});

//  qr camera feature adding --




// QR Code Scan System Applying CHATGPT1 END

// Start the server
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

console.log(users)
