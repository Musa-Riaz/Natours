const dotenv = require('dotenv');
dotenv.config({path : './config.env'});
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then((con)=>{
  console.log("DB was connected successfully")
})


const port = 3000 || process.env.PORT ; //This is our port number
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

