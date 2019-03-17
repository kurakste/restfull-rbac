import express from 'express';
import userRouter from './routers/user';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; 


const app = express();
const port = 3000;
dotenv.config();

const url = 
    'mongodb+srv://' 
    + process.env.mongoDbLogin + ':' 
    + process.env.mongoDbPwd + '@' 
    + process.env.mongoDbHost; 

mongoose.connect(
    url,
    { useNewUrlParser: true },
);

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('connect');
    res.send('hello world!');
});

app.use('/user', userRouter);

app.use((req, res, next) => {
    let error: any;
    error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Error handlers
app.use((error: any, req: any, res: any, next: any) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({
        error: { message: error.message }
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})