import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { levelsRouter } from "./routes/levels";
import { ratingsRouter } from "./routes/ratings";
import { usersRouter } from "./routes/users";

const app = express();
app.use(express.json());

const allowedOrigins = ["https://kyoobo.vercel.app"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/levels", levelsRouter);
app.use("/ratings", ratingsRouter);

app.listen(3000);
