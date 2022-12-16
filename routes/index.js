const postRoutes = require('./posts');
const reportRoutes = require('./reports');
const userRoutes = require('./users');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/posts', postRoutes);
    app.use('/reports', reportRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;