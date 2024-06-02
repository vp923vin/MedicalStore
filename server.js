const express = require('express');
const path = require('path');

require('./src/Configs/db');
const configRoutes = require('./src/Configs/routes');
const { appConfig } = require('./src/Configs/app');
const errorMiddleware  = require('./src/Middlewares/errorMiddleware');
const initializeDatabase = require('./src/Services/Utils/dbSync');
const app = express();

app.set('views', path.join(__dirname, 'src', 'Views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

configRoutes(app);

app.get('/', (req, res) => {
    res.send("Nodejs Env Is Set");
});

// app.use(errorMiddleware);

initializeDatabase().then(() => {
    app.listen(appConfig.port, () => {
        console.log(`Server is started at port ${appConfig.port} and browser url is ${appConfig.url}:${appConfig.port}`);
        console.log(`App name is ${appConfig.appName} and Environment is Set ${appConfig.appEnvironment}`);
    });
});