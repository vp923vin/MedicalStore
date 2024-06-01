const express = require('express');
const path = require('path');

require('./src/Config/db');

const app = express();

app.set('views', path.join(__dirname, 'src', 'Views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
configRoutes(app);

app.get('/', (req, res) => {
    res.send("Nodejs Env Is Set");
});

app.listen(port, async () => {
    console.log(`Server is started at port ${port} and browser uri is ${url}:${port},
    app name is ${appName} and Environment is Set ${environment}`)
});