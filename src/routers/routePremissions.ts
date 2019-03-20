/**
 *  premited - wich role premited to use this route.
 *  4 - any, 3 - employee  1 - only roote user
 *  
 * */ 

const premissinons = [
  { path: '/user/signin', method: 'POST', premited: 4 },
  { path: '/user/signup', method: 'POST', premited: 4 },
  { path: '/user/list', method: 'GET', premited: 1 },
  { path: '/user/one', method: 'GET', premited: 1 },
  { path: '/user/one', method: 'DELETE', premited: 1 },
]

export default premissinons;