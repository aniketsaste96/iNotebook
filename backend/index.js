const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express()
const port = 5000


app.use(cors())
//if you want to use request.body you need to use middleware
app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))






//Good folder structure should be maintained!!!






app.listen(port, () => {
    console.log(`iNotebook app listening on port ${port}`)
})


