import User from '../model/users';

async function isUserExist(email: string) {
  let usr = await User.find({ email: email })
  if (usr.length) {
    return true;
  } else {
    return false
  }
}

export default isUserExist;