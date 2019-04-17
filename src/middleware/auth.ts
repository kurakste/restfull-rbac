import jwt from'jsonwebtoken';
import premissions from '../routers/routePremissions';
import _ from 'lodash';
import apiDataObject from '../helpers/apiDataObject';

const auth = (req: any, res: any, next:any) => {
  
  const path = req.path.split('/');
  console.log('path:', path);
  if (path[1]==='public') return next();

  const prem: any = _.filter(
    premissions, 
    { path: req.path, method: req.method }
    );
    
    if (prem.length > 1) throw new Error('We have more then one premission records for this path');
    if (prem.length === 0) return res
    .status(200)
    .json(apiDataObject(null, false, 'Auth error'));
    
    if (prem[0].premited === 5) {
      return next(); // This path is not protected
    }
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY has to be set in .env file');
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user: any = jwt.verify(token, process.env.JWT_KEY);
      if (user.role > prem[0].premited) return res
      .status(200)
      .json(apiDataObject(null, false, 'Premmision denied.')) 
    return next();
  } catch (error) {
      return res.status(200)
      .json(apiDataObject(null, false, 'Auth error.')); 
  }
};

export default auth;
