import controller from "../controllers/ManagerController";

const debugMessageLogger = (module: string, info: string, err: Error|null = null) => {
  console.log(`---------------------------------------------------------------------`)
  console.log(`-----------Debug information from: ${module} ---------`);
  console.log(`Info: ${info}`);
  if (err) {
    console.log('error: ', err);
  }
  console.log(`---------------------------------------------------------------------`)
}

export default debugMessageLogger;