
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const bootstrap = () => {
  dotenv.config();
  
  const url:any = (process.env.mongoDbLogin) ? 'mongodb+srv://' 
      + process.env.mongoDbLogin + ':' 
      + process.env.mongoDbPwd + '@' 
      + process.env.mongoDbHost 
      : 'mongodb://' + process.env.mongoDbHost;
  
      console.log('db connecting string: ', url)
  
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
  return mongoose;
}

export default bootstrap;