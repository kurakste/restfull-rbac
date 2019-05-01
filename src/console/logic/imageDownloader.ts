import fs from 'fs';
import request from 'request';

const imgDownloader = async ( uri: string, filename: string, callback: any) => {
  return new Promise((resolve) => {
    request.head(uri, function(err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
        callback();
        return resolve();
      });
    });

  });
};

export default imgDownloader;