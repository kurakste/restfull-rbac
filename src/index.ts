import express from 'express';
import userRouter from './routers/user';
import managersRoutes from './routers/managersRoute';
import superviserRoutes from './routers/supervisorRoute';
import adminRoutes from './routers/adminRoute';
import watcherRouter from './routers/watcher';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; 
import auth from './middleware/auth';
import cors from 'cors';

const app = express();
const port = 9090;
dotenv.config();

const url:any = (process.env.mongoDbLogin) ? 'mongodb+srv://' 
    + process.env.mongoDbLogin + ':' 
    + process.env.mongoDbPwd + '@' 
    + process.env.mongoDbHost 
    : 'mongodb://' + process.env.mongoDbHost;

console.log('db connecting string: ', url);

mongoose
    .connect(
        url,
        { useNewUrlParser: true },
    )
    .catch(err => {
        console.log('Data base connection error. Check dbase string in .env');
        process.exit(0);
    });
// It fix deprication alerts.
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(cors({
}));

/**
 * At a minimum, disable X-Powered-By header
 * If you don’t want to use Helmet, then at least disable 
 * the X-Powered-By header. Attackers can use this header 
 * (which is enabled by default) to detect apps running Express 
 * and then launch specifically-targeted attacks.So, best practice 
 * is to to turn off the header with the app.disable() method:
 */
app.disable('x-powered-by');

app.use('/public', express.static('public'));
app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
  });

app.use(bodyParser.json());
app.use(auth);

app.get('/', (req, res) => {
    console.log('connect');
    res.send('hello world!');
});

app.use('/user', userRouter);
app.use('/manager', managersRoutes);
app.use('/supervisor', superviserRoutes);
app.use('/admin', adminRoutes);
app.use('/watcher', watcherRouter);

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