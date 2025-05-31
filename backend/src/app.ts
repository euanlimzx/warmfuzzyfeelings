import express from "express";
import cors from "cors";
import { getAWSSignedUrl } from "./utils/mediaHandler";
import { createStructuredCharacterSummary } from "./utils/characterSummary";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const characterDesc = [
    {
      description:
        "Happy Birthday to one of the kindest souls out there! Your warmth and generosity light up every room you enter.",
      author: "Alex Rivera",
    },
    {
      description:
        "Wishing you a day as incredible as you are! Your energy and passion inspire everyone lucky enough to know you.",
      author: "Jamie Chen",
    },
    {
      description:
        "To someone who makes every moment brighter—may this birthday bring you all the joy you give to others daily.",
      author: "Samantha Lee",
    },
    {
      description:
        "Celebrating the amazing person you are today! Your strength, humor, and heart are unmatched.",
      author: "Marcus Bennett",
    },
    {
      description:
        "You make the world better just by being in it. Here's to another year of spreading joy and living fully!",
      author: "Priya Das",
    },
    {
      description:
        "May your birthday be filled with the same happiness and laughter you bring to everyone around you.",
      author: "Elena Torres",
    },
    {
      description:
        "Cheers to you and the beautiful life you're creating—your birthday is just another chapter in your amazing story.",
      author: "Jordan Malik",
    },
    {
      description:
        "The way you uplift and care for others is truly special. Hope today reminds you how loved and appreciated you are.",
      author: "Nina Patel",
    },
    {
      description:
        "Another year wiser, brighter, and even more awesome—keep being the wonderful person you are!",
      author: "Tariq Lawson",
    },
    {
      description: "Just absolutely wonderful",
      author: "Hailey Brooks",
    },
  ];

  const response = await createStructuredCharacterSummary(
    "James",
    characterDesc,
  );
  res.status(200).send(response);
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
