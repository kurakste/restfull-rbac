import fs from 'fs';
import request from 'request';

const imgDownloader = (
  uri:string, 
  filename:string, 
  callback:any
  ) => {
  console.log('current dir: ', __dirname);
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

export default imgDownloader;