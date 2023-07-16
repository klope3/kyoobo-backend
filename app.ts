import express from "express";
import cors from "cors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { intParseableString } from "./validations";
import { prisma } from "./client";
import { NOT_FOUND, OK } from "./statusCodes";
import { message } from "./utility";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "Placeholder" });
});

//TODO:log in

//TODO:create account

//TODO:get level by id
app.get(
  "/levels/:levelId",
  validateRequest({
    params: z.object({
      levelId: intParseableString,
    }),
  }),
  async (req, res) => {
    const level = await prisma.level.findUnique({
      where: {
        id: +req.params.levelId,
      },
      include: {
        characters: true,
        tiles: true,
        pickups: true,
      },
    });
    if (!level) {
      return res.status(NOT_FOUND).send(message("Level not found."));
    }
    res.status(OK).send(level);
  }
);

//TODO:get completions for level

//TODO:get completions for specific user

//TODO:get ratings for level

//TODO:get all ratings for specific user

//TODO:post level completion

//TODO:post level rating

//TODO:delete level rating

app.listen(3000);
