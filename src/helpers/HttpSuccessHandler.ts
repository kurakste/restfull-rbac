import express from 'express';

function HttpErrorHandler(
  res: express.Response, block: string, payload: Array<any>|Object
): void {
  //console.log(`Success response from block: ${block} with payload: ${payload}`);
  res.status(200).json({ success: true, message: 'error', error: null, payload: payload });
}

export default HttpErrorHandler;