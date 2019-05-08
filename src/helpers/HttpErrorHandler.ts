import express from 'express';

function HttpErrorHandler(
  res: express.Response, block: string, err: Error
): void {
  console.log(`Error in ${block}: ${err}`);
  res.status(200).json({ success: false, error: err.message, payload: null });
}

export default HttpErrorHandler;