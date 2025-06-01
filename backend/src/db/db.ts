import {
  CardFormResponse,
  FunctionResponse,
  FunctionErrorResponse,
  RegisterMakeAWishEmail,
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

export const registerMakeAWishEmail = async ({
  cardUUID,
  email,
}: RegisterMakeAWishEmail) => {
  try {
    const { data, error } = await supabaseClient
      .from("Friends_To_Notify")
      .insert({
        card_id: cardUUID,
        email,
      });

    if (error) {
      return { ok: false, message: "Could not register email" };
    }

    return { ok: true, message: "Email registered" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "There was an error registering the email" };
  }
};

export const getCardFromUUID = async ({ cardUUID }: { cardUUID: string }) => {
  try {
    const { data, error } = await supabaseClient
      .from("Card")
      .select()
      .eq("id", cardUUID)
      .single();

    console.log(data);

    if (error || !data) {
      return { ok: false, message: "Could not find the desired card" };
    }

    return { ok: true, card: data };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      message: "There was an issue finding the desired card",
    };
  }
};

export const getAllCardResponsesForUUID = async ({
  cardUUID,
}: {
  cardUUID: string;
}) => {
  try {
    const { data, error } = await supabaseClient
      .from("Card_Form_Response")
      .select()
      .eq("card_id", cardUUID);

    if (error) {
      return { ok: false, message: "Error retrieving card" };
    }

    return { ok: true, cards: data };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      message: "There was an error fetching the associated card responses",
    };
  }
};
