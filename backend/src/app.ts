import express, { response } from "express";
import cors from "cors";
import { getAWSSignedUrl } from "./utils/mediaHandler";
import { createStructuredCharacterSummary } from "./utils/characterSummary";
import { validateInputData } from "./middleware/inputValidationMiddleware";
import {
  CardFormResponseSchema,
  RegisterMakeAWishEmailSchema,
} from "./routerTypes";
import {
  createCardFormResponse,
  registerMakeAWishEmail,
  getCardFromUUID,
  getAllCardResponsesForUUID,
  joinWaitlist,
} from "./db/db";
import { developmentLogger } from "./middleware/inputLoggerMiddleware";
import toCamelCase from "./utils/toCamelCase";

const app = express();

app.use(express.json());
app.use(cors());
app.use(developmentLogger);

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

  res.status(200).send("hi");
});

app.post("/make-a-wish/upload-image", async (req, res) => {
  const { fileName, fileSize, fileType } = req.body;

  if (!fileName) {
    res.status(400).send({
      ok: false,
      message: "Missing File Name",
    });
    return;
  }

  const signedUrlData = await getAWSSignedUrl(fileName, fileSize, fileType);
  if (signedUrlData.ok) {
    res.status(200).send(signedUrlData);
    return;
  } else if (signedUrlData.fileValidationError) {
    res.status(403).send(signedUrlData);
  } else {
    res.status(404).send(signedUrlData);
    return;
    return;
  }
});

// @shawn: add zod validation
app.post(
  "/make-a-wish/upload-card-response",
  validateInputData(CardFormResponseSchema),
  async (req, res) => {
    const cardCreationResponse = await createCardFormResponse(req.body);

    if (cardCreationResponse.ok) {
      res.status(201).send(cardCreationResponse);
      return;
    } else {
      res.status(500).send(cardCreationResponse);
      return;
    }
  },
);

app.post(
  "/make-a-wish/register-email",
  validateInputData(RegisterMakeAWishEmailSchema),
  async (req, res) => {
    const registerMakeAWishEmailResponse = await registerMakeAWishEmail(
      req.body,
    );

    if (registerMakeAWishEmailResponse.ok) {
      res.status(201).send(registerMakeAWishEmailResponse);
      return;
    } else {
      res.status(500).send(registerMakeAWishEmailResponse);
      return;
    }
  },
);

app.post("/join-waitlist", async (req, res) => {
  const { email } = req.body;
  const waitlistResponse = await joinWaitlist(email);
  res.status(200).send(waitlistResponse);
});

app.get("/get-card-from-uuid", async (req, res) => {
  const cardUUID = req.query.cardUUID;

  if (typeof cardUUID === "string") {
    const card = await getCardFromUUID({ cardUUID });

    if (card.ok) {
      res.status(200).send(toCamelCase(card));
      return;
    } else {
      res.status(500).send(card);
      return;
    }
  } else {
    res
      .status(400)
      .send({ ok: false, message: "please specify a valid cardUUID" });
  }
});

app.get("/create-structured-summary", async (req, res) => {
  const { password, cardUUID } = req.query;

  if (password !== process.env.CHARACTER_SUMMARY_GENERATION_PASSWORD) {
    res.status(403).send("Nice try bro");
    return;
  }

  if (typeof cardUUID === "string") {
    const responsesForCard = await getAllCardResponsesForUUID({ cardUUID });

    if (!responsesForCard.ok || responsesForCard.cards?.length === 0) {
      res.status(404).send("welp, we could not get the data you wanted");
      return;
    }

    const aggregatedResponses = [];

    if (!responsesForCard.cards) {
      res.status(404).send("Could not find anything");
      return;
    }

    for (const {
      question_and_response,
      responder_name,
    } of responsesForCard.cards!) {
      aggregatedResponses.push({
        questionAndResponse: question_and_response,
        responderName: responder_name!,
      });
    }

    const structuredCharacterSummary = await createStructuredCharacterSummary(
      cardUUID,
      aggregatedResponses,
    );
  }
});

export default app;
