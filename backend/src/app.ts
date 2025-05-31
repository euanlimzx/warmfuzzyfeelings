import express from "express";
import { getAWSSignedUrl } from "./utils/mediaHandler";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send("helloi");
});

app.post("/make-a-wish/upload-image", async (req, res) => {
  const { fileName } = req.body;
  console.log("The file name is", fileName);

  const signedUrl = await getAWSSignedUrl();
  res.status(200).send(signedUrl);
});

export default app;
