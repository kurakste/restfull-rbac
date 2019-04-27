import express from 'express';

function HttpErrorHandler(
  res: express.Response, block: string, error: Error
): void {
  console.log(`Error in ${block}: ${error}`);
  res.status(200).json({ message: 'error', error: error });
}

export default HttpErrorHandler;