import express from 'express';

function HttpErrorHandler(
  res: express.Response, block: string, error: Error
): void {
  console.log(`Error in ${block}: ${error}`);
  res.status(200).json({ success: false, error: error, payload: null });
}

export default HttpErrorHandler;