import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { levelsRouter } from "./routes/levels";
import { ratingsRouter } from "./routes/ratings";
import { usersRouter } from "./routes/users";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/levels", levelsRouter);
app.use("/ratings", ratingsRouter);

app.listen(3000);
