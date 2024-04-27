require('dotenv').config();
require('express-async-errors');
const express = require('express');
const authRouter=require('./routes/auth.js')
const jobsRouter=require('./routes/jobs.js')
const authenticateUser=require('./middleware/authentication')
const app = express();
app.use(express.json());

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)



// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const router = require('./routes/auth');
const connectDB = require('./db/connect.js');


// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
  await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
