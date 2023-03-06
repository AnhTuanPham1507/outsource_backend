require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/Index");

const app = express();
const port = process.env.PORT | 3003;


app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionSuccessStatus: 204,
    credentials: true,
  })
);

app.use("/", router);
app.listen(port, () => {
  console.log(`Port ${port}`);
});

app.on('exit',() => {
  schedule.destroy()
})
