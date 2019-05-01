import controller from "../controllers/ManagerController";

const debugMessageLogger =
  (
    module: string,
    info?: Array<string> | string | object,
    err: Error | null = null
  ) => {
    console.log(`----Debug information from: ${module} --`);
    if (Array.isArray(info)) {
      info.map(el => console.log(el));
    } else {
      console.log(info);
    };
    if (err) {
      console.log('error: ', err);
    }
    //console.log(`-------------------------`)
  }

export default debugMessageLogger;