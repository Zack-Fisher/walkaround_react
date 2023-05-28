const ejs = require('ejs');

export const define_routes = (app) => {
    // Define a route to render the HTML template
    app.get('/', (req, res) => {
        // Render the 'index' template and pass any necessary data
        res.render('index', { title: 'My Express App' });
    });

    app.get('/route2', (req, res) => {
        console.log('POST /route2', req.body);
        res.json({ message: 'Received POST to /route2', body: req.body });
    });
}