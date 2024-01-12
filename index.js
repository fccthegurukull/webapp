const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require('express-session'); // Declare session only once
const methodOverride = require("method-override");
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
app.post("/register", checkNotAuthenticated, async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(), 
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        console.log(users); // Display newly registered in the console
        res.redirect("/login")
        
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})

// Routes
app.get('/', checkAuthenticated, (req, res) => {
    res.render("index.ejs", {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})
// End Routes

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

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

// Route for Hariom Kumar's page
app.get('/hariom', (req, res) => {
  res.render('teachers/hariom-kumar/hariom', { pageTitle: "Hariom Kumar's Page" });
});

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
