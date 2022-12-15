const userRoutes = require('./users');
const postRoutes = require('./posts');
const reportRoutes = require('./reports');
const homeRoutes = require('./home');

const constructorMethod = (app) => {
    app.use('/', homeRoutes);
    app.use('/posts', postRoutes);
    app.use('/reports', reportRoutes);
    app.use('/users', userRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;