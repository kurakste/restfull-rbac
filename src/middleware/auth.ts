import jwt from'jsonwebtoken';
import premissions from '../routers/routePremissions';
import _ from 'lodash';

const auth = (req: any, res: any, next:any) => {
  const prem: any = _.filter(
    premissions, 
    { path: req.path, method: req.method }
  );

  if (prem.length > 1) throw new Error('We have more then one premission records for this path');
  if (prem.length === 0) return res
    .status(404)
    .json({ message: 'Premission denied' });
  
  if (prem[0].premited === 4) {
    return next(); // This path is not protected
  }
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY has to be set in .env file');
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user: any = jwt.verify(token, process.env.JWT_KEY);
    if (user.role > prem[0].premited) return res.status(404).json({
      message: 'Premission denied'
    }) 
    return next();
  } catch (error) {
      return res.status(404).json({
          message: 'Auth faild'
      })
  }
};

export default auth;
