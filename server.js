const express = require("express");
require('./config/connect');

const app = express();
app.use(express.json());


const articleApi = require("./routes/article");
app.use('/article', articleApi);
app.use('/getimage', express.static('./uploads'));

const authorApi = require("./routes/author");
app.use('/author', authorApi);





app.listen(3000, () => {
    console.log("server work");
})