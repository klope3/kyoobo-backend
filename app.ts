import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { levelsRouter } from "./routes/levels";
import { ratingsRouter } from "./routes/ratings";
import { usersRouter } from "./routes/users";

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://kyoobo.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/levels", levelsRouter);
app.use("/ratings", ratingsRouter);

const port = process.env.PORT;
app.listen(port || 3000);
