const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlExp = require('express-graphql');
const userGraphqlSchema = require('./graphql/schema/index');
const userGraphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/auth')

const app = express();

// parse application/json
app.use(bodyParser.json());

// allow request from frontend port
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// authorization middleware
app.use(isAuth);

// graphql middleware
app.use(
    '/graphql',
    graphqlExp({
        schema: userGraphqlSchema,
        rootValue: userGraphqlResolvers,
        graphiql: true
    })
);


//This line connects mongoose to our mongoDB database
const mongoURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hvo2l.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(
    mongoURL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    err => {
    if (err) return console.error("Connection Failed !");
    console.log("Connection Successful");
    }
);

// listen local server
const port = 8000;
app.listen(port, ()=>{
    console.log(`The web server is connected!!`);
});