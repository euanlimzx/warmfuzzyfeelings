import {
  CardFormResponse,
  FunctionResponse,
  FunctionErrorResponse,
} from "../routerTypes";
import supabaseClient from "./client";
import { Tables } from "./dbTypes";

type CardFormResponseRow = Tables<"Card_Form_Response">;
interface CardFormFunctionResponse extends FunctionResponse {
  createdCard: CardFormResponseRow;
}

export const createCardFormResponse = async ({
  responseUUID,
  imageUrl,
  questionAndResponse,
  cardUUID,
}: CardFormResponse): Promise<
  CardFormFunctionResponse | FunctionErrorResponse
> => {
  try {
    const { data, error } = await supabaseClient
      .from("Card_Form_Response")
      .insert({
        card_id: cardUUID,
        id: responseUUID,
        image_url: imageUrl,
        question_and_response: questionAndResponse,
      })
      .select()
      .single();

    if (error || !data) {
      return { ok: false, message: "No data returned from insert" };
    }

    return { ok: true, createdCard: data };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "There was an error creating the card" };
  }
};
