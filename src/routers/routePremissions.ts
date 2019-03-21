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
  { path: '/manager/add-item', method: 'POST', premited: 3 },
  { path: '/manager/items', method: 'GET', premited: 3 },
  { path: '/manager/check-item', method: 'GET', premited: 3 },
  { path: '/supervisor/get-free', method: 'GET', premited: 2 },
  { path: '/supervisor/get-my-items', method: 'GET', premited: 2 },
  { path: '/supervisor/pickup-item', method: 'POST', premited: 2 },
  { path: '/supervisor/change-status', method: 'POST', premited: 2 },
  { path: '/admin/users', method: 'GET', premited: 1 },
  { path: '/admin/get-all-items', method: 'GET', premited: 1 },
  { path: '/admin/user', method: 'PATCH', premited: 1 },
  { path: '/admin/user', method: 'DELETE', premited: 1 },
]

export default premissinons;