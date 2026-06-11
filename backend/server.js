const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  try {
    app.listen(PORT, () => {
      console.log(`Server running on localhost: ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start the server. ${error}`);
  }
}
startServer();
