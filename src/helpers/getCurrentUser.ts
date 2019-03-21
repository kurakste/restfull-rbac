import jwt from'jsonwebtoken';
/**
 * It sets global user to have access everywehere.  
 */
const getCurrentUser = (req: any) => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY has to be set in .env file');
  const token = req.headers.authorization.split(' ')[1];
  const out:any = jwt.verify(token, process.env.JWT_KEY);
  return out;
};

export default getCurrentUser;
