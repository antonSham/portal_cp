require("dotenv").config();

const express = require("express");
const apiRouter = require("./routes");

const app = express();

app.use("/api/v1", apiRouter);

app.use((req, res) => {
  res.status(404).send("404. Not Found.");
});
app.use((err, req, res, next) => {
  res.status(500).send("500. Internal server error.");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port ${process.env.PORT}`)
);
