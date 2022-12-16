const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
        name: 'AuthCookie',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: false,
        resave: false,
        cookie: {maxAge: 60000}
    })
);

app.use(async (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render('userLogin');
    } else {
        next();
    }
});


app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});