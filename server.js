const fs = require('fs')
const express = require('express')
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/log', (req, res) => {
  res.setHeader("content-type", "text/plain")
  fs.createReadStream("./big_log_file.txt").pipe(res)
})

app.listen(3001, () => console.log('Log file server app listening at port 3001'))