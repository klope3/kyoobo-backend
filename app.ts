import express from "express";
import { authRouter } from "./routes/auth";
import { levelsRouter } from "./routes/levels";
import { ratingsRouter } from "./routes/ratings";
import { usersRouter } from "./routes/users";

const app = express();
const allowedOrigins = [
  "https://kyoobo.vercel.app",
  "https://kyoobo-kezuqf5ix-klope3.vercel.app/",
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
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
