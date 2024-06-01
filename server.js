const express = require('express');
const path = require('path');

require('./src/Configs/db');
const configRoutes = require('./src/Configs/routes');
const { appConfig } = require('./src/Configs/app');
const app = express();

app.set('views', path.join(__dirname, 'src', 'Views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
configRoutes(app);

app.get('/', (req, res) => {
    res.send("Nodejs Env Is Set");
});

app.listen(appConfig.port, async () => {
    console.log(`Server is started at port ${appConfig.port} and browser uri is ${appConfig.url}:${appConfig.port},
    app name is ${appConfig.appName} and Environment is Set ${appConfig.appEnvironment}`)
});