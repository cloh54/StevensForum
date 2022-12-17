const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use;
app.use('/public', static);
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

app.engine('handlebars', exphbs.engine({defaultLayout: 'main',
                                        helpers: {
                                          eq: (v1, v2) => v1 === v2,
                                          ne: (v1, v2) => v1 !== v2,
                                          lt: (v1, v2) => v1 < v2,
                                          gt: (v1, v2) => v1 > v2,
                                          lte: (v1, v2) => v1 <= v2,
                                          gte: (v1, v2) => v1 >= v2,
                                          eqid: (v1, v2) => v1.toString() === v2.toString(),
                                          not: (v1) => !v1,
                                          empt: (v1) => v1.length === 0,
                                          and() {
                                              return Array.prototype.every.call(arguments, Boolean);
                                          },
                                          or() {
                                              return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
                                          }
                                        }}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});