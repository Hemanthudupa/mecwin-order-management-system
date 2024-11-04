import { connectToDataBase } from "./database";
import { app } from "./app";
import { runSeedUsers } from "./utils/authentication";
connectToDataBase().then((res) => {
  if (res) {
    app.listen(process.env.DB_PORT, () => {
      console.log("server is running on the port ", process.env.DB_PORT);
    });
    runSeedUsers();
  } else {
    console.log("failed to connect to the data base ");
  }
});
