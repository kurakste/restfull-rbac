/**
 *  premited - wich role premited to use this route.
 *  4 - any, 3 - employee  1 - only roote user
 *  
 * */ 

const premissinons = [
  
  { path: '/buyer/free-products', method: 'GET', premited: 4 },
  { path: '/buyer/products', method: 'GET', premited: 4 },
  { path: '/buyer/pickup-product', method: 'POST', premited: 4 },
  { path: '/buyer/product', method: 'PATCH', premited: 4 },
  { path: '/manager/add-item', method: 'POST', premited: 3 },
  
  { path: '/manager/items', method: 'GET', premited: 3 },
  { path: '/manager/parse', method: 'GET', premited: 3 },
  { path: '/manager/item', method: 'PATCH', premited: 3 },
  { path: '/manager/item', method: 'DELETE', premited: 3 },
  { path: '/manager/check-item', method: 'GET', premited: 3 },
  
  { path: '/supervisor/get-free', method: 'GET', premited: 2 },
  { path: '/supervisor/get-my-items', method: 'GET', premited: 2 },
  { path: '/supervisor/pickup-item', method: 'POST', premited: 2 },
  { path: '/supervisor/item', method: 'PATCH', premited: 2 },
  { path: '/supervisor/change-status', method: 'POST', premited: 2 },
  
  { path: '/director/user', method: 'PATCH', premited: 1 },
  { path: '/director/user', method: 'DELETE', premited: 1 },
  { path: '/director/vac', method: 'GET', premited: 1 },
  { path: '/director/pickup', method: 'POST', premited: 1 },
  { path: '/director/make-payment', method: 'POST', premited: 1 },
  { path: '/director/paid', method: 'GET', premited: 1 },
  { path: '/director/my-products', method: 'GET', premited: 1 },
  { path: '/director/users', method: 'GET', premited: 1 },
  { path: '/director/product', method: 'PATCH', premited: 1 },
  
  { path: '/admin/user', method: 'PATCH', premited: 0 },
  { path: '/admin/user', method: 'DELETE', premited: 0 },
  { path: '/admin/waiting', method: 'GET', premited: 0 },
  { path: '/admin/vac', method: 'GET', premited: 0 },
  { path: '/admin/pickup', method: 'POST', premited: 0 },
  { path: '/admin/make-payment', method: 'POST', premited: 0 },
  { path: '/admin/paid', method: 'GET', premited: 0 },
  { path: '/admin/checking', method: 'GET', premited: 0 },
  { path: '/admin/users', method: 'GET', premited: 0 },
  { path: '/admin/product', method: 'PATCH', premited: 0 },
  
  { path: '/user/list', method: 'GET', premited: 1 },
  { path: '/user/one', method: 'DELETE', premited: 1 },
  { path: '/user/one', method: 'GET', premited: 3 },
  { path: '/user/one', method: 'PATCH', premited: 3 },
  { path: '/user/signin', method: 'POST', premited: 5 },
  { path: '/user/signup', method: 'POST', premited: 5 },
]

export default premissinons;