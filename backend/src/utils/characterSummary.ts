import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { Json } from "../db/dbTypes";

interface birthdayPersonComments {
  responderName: string;
  questionAndResponse: Json;
}

const openai = new OpenAI();

const SummarySources = z.object({
  summary: z.array(
    z.object({
      word: z.string(),
      sources: z.array(
        z.object({
          author: z.string(),
          message: z.string(),
        }),
      ),
    }),
  ),
});
type ParsedSummarySources = z.infer<typeof SummarySources>;

const CharacterTraits = z.object({
  descriptiveTitle: z.string(),
  summaryOfTraits: z.string(),
  singleWordTraits: z.array(z.string()).max(4),
});
type ParsedCharacterTrait = z.infer<typeof CharacterTraits>;

interface CharacterSummaryResponse
  extends ParsedSummarySources,
    ParsedCharacterTrait {
  ok: boolean;
}

interface CharacterSummaryErrorResponse {
  ok: boolean;
  message: string;
}

const determineCharacterTraits = async (comments: string) => {
  const response = await openai.responses.parse({
    model: "gpt-4o-2024-08-06",
    input: [
      {
        role: "system",
        content: `
          You are an expert on understanding and celebrating people. 
          Based on the charcter testimonials given, create a mischevious and fun-themed character summary that would put a smile on the face of the reader.
          Make your summary no longer than 80 words.

          <Examples>
            The Comfort Zone Champion
            You know what you like and you're not ashamed of it. You've got your favorite coffee shop, your go-to dinner order, and that one friend who always gets your jokes. Life's good when it's predictable.
            FRLS
            Familiarity · Routine · Loyalty · Stability

            The Deep Diver
            You don't mess around with surface-level stuff. When something catches your eye, you're going full obsession mode—reading every article, watching every video, basically becoming the unofficial expert.
            FRVS
            Familiarity · Routine · Variety · Stability

            The "What's Over There?" Person
            You're basically allergic to doing the same thing twice. While everyone else is sticking to the plan, you're already three steps ahead asking "but what if we tried this instead?"
            ERVG
            Exploration · Routine · Variety · Growth

            The Human Bridge
            You're that friend who somehow knows someone everywhere you go. You collect people and experiences like trading cards, and you're always trying to get your different friend groups to hang out.
            ERVS
            Exploration · Routine · Variety · Social

            The Marathon Runner
            You play the long game like nobody's business. While everyone else is chasing shiny new things, you're over here building something that'll actually last. Slow and steady isn't boring—it's smart.
            FRLS
            Foundation · Routine · Loyalty · Stability

            The Everything Bagel
            Your brain is like having 47 browser tabs open at once, and honestly? You wouldn't have it any other way. Yesterday it was pottery, today it's ancient history, tomorrow who knows.
            ENVG
            Exploration · Newness · Variety · Growth

            The Ride-or-Die
            When you're in, you're ALL in. Whether it's a hobby, a person, or that weird indie band nobody's heard of, you stick around through the good times and the "why am I doing this?" times.
            FNLS
            Familiarity · Newness · Loyalty · Stability

            The Shake-Things-Up Friend
            You're the one who suggests the random road trip, tries the weird menu item, and asks "but what if we did it completely differently?" You make life more interesting just by existing.
            ENVG
            Exploration · Newness · Variety · Growth
          </Examples>
          `,
      },
      {
        role: "user",
        content: `
        Character summary: ${JSON.stringify(comments)}
      `,
      },
    ],
    text: {
      format: zodTextFormat(CharacterTraits, "characterTraits"),
    },
  });

  return response.output_text;
};

export const createStructuredCharacterSummary = async (
  birthdayPerson: string,
  comments: birthdayPersonComments[],
): Promise<CharacterSummaryResponse | CharacterSummaryErrorResponse> => {
  const stringifiedCharacterSummary = JSON.stringify(comments);
  const generatedSummary = await determineCharacterTraits(
    stringifiedCharacterSummary,
  );

  let summaryOfTraits = null;
  let parsedCharacterTraits = null;
  try {
    parsedCharacterTraits = JSON.parse(
      generatedSummary,
    ) as ParsedCharacterTrait;
    summaryOfTraits = parsedCharacterTraits.summaryOfTraits;
  } catch (err) {
    console.error("Error creating a character summary", err);
    return { ok: false, message: JSON.stringify(err) };
  }

  const response = await openai.responses.parse({
    model: "gpt-4o-2024-08-06",
    input: [
      {
        role: "system",
        content: `
        Based on the given character summary and source, identify the words in the summary that can be attributed to messages in the source.
        Follow the given schema.
        Create one array element per word in the summary, leaving the sources empty if there are no sources that you can attribute to the word.
        Avoid repetition of the sources as much as possible.
          `,
      },
      {
        role: "user",
        content: `
        Character summary: ${summaryOfTraits}

        Source: ${stringifiedCharacterSummary}
      `,
      },
    ],
    text: {
      format: zodTextFormat(SummarySources, "summarySources"),
    },
  });

  const sourcedSummary = response.output_text;
  try {
    const parsedSummarySources = JSON.parse(
      sourcedSummary,
    ) as ParsedSummarySources;

    return { ok: true, ...parsedSummarySources, ...parsedCharacterTraits };
  } catch (err) {
    console.error("Error creating summarizing character traits", err);
    return { ok: false, message: JSON.stringify(err) };
  }
};
