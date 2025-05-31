import express from "express";
import cors from "cors";
import { getAWSSignedUrl } from "./utils/mediaHandler";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.status(200).send("helloi");
});

app.post("/make-a-wish/upload-image", async (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    res.send(400).send({
      ok: false,
      message: "Missing File Name",
    });
  }

  const signedUrlData = await getAWSSignedUrl(fileName);
  if (signedUrlData.ok) {
    res.status(200).send(signedUrlData);
  } else {
    res.status(404).send(signedUrlData);
  }
});

export default app;
