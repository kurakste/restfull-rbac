/**
 * 
 * @param {any} payload - any type of payload; 
 * @param {boolean} success - result of operation; 
 * @param {sring} message - 'message; 
 * 
 */
export default function (
    payload: any, 
    success: boolean = true, 
    message: string = ''
  ) {
    return {
      payload, success, message
    }
  }