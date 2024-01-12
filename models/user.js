app.get('/myprofile', (req, res) => {
  // Get the user object from wherever it's stored (e.g., from the session)
  const user = req.session.user;

  // Render the myprofile page and pass the user object
  res.render('myprofile', { user: user });
});

app.post('/login', (req, res) => {
  // Assuming user is retrieved from the database based on the provided email and password
  const user = /* logic to retrieve user based on email and password */;

  // Set the user information in the session
  req.session.user = user;

  // Redirect or respond as needed
});

const session = require('express-session');
app.use(session({
    secret: 'xvbrx',
    resave: false,
    saveUninitialized: false
}));
