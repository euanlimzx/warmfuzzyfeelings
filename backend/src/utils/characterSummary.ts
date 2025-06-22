import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { FunctionErrorResponse } from "../routerTypes";
import getLanguageBasedPrompt from "./getPromptBasedOnLanguage";

interface birthdayPersonComments {
  responderName: string;
  personDescriptionResponse: string;
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

export interface CharacterSummaryResponse
  extends ParsedSummarySources,
    ParsedCharacterTrait {
  ok: true;
}

const determineCharacterTraits = async (
  comments: string,
  characterTraitsPrompt: string,
) => {
  const response = await openai.responses.parse({
    model: "gpt-4o-2024-08-06",
    input: [
      {
        role: "system",
        content: characterTraitsPrompt,
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
): Promise<CharacterSummaryResponse | FunctionErrorResponse> => {
  const stringifiedCharacterSummary = JSON.stringify(comments);

  let rawTextResponses = "";
  comments.forEach((comment) => {
    rawTextResponses += comment.personDescriptionResponse;
  });

  const languageBasedPrompt = await getLanguageBasedPrompt(rawTextResponses);

  const generatedSummary = await determineCharacterTraits(
    stringifiedCharacterSummary,
    languageBasedPrompt.characterTraits,
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
        content: languageBasedPrompt.summary,
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
