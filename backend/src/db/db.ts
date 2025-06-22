import {
  CardFormResponse,
  FunctionResponse,
  FunctionErrorResponse,
  RegisterMakeAWishEmail,
} from "../routerTypes";
import supabaseClient from "./client";
import { Json, Tables } from "./dbTypes";

type CardFormResponseRow = Tables<"Card_Form_Response">;
interface CardFormFunctionResponse extends FunctionResponse {
  ok: true;
  createdCard: CardFormResponseRow;
}

export const joinWaitlist = async (email: string) => {
  try {
    const { data, error } = await supabaseClient
      .from("Waitlist")
      .insert({ email: email });

    if (error) {
      console.log(error);
      return { ok: false, message: "Could not join waitlist" };
    }

    return { ok: true, message: "Joined waitlist" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "There was an error joining the waitlist" };
  }
};

export const createCardFormResponse = async ({
  responseUUID,
  imageUrl,
  imageUrls,
  memoryResponse,
  descriptionResponse,
  finalMessageResponse,
  cardUUID,
  name,
}: CardFormResponse): Promise<
  CardFormFunctionResponse | FunctionErrorResponse
> => {
  try {
    const { data, error } = await supabaseClient
      .from("Card_Form_Response")
      .insert({
        card_id: cardUUID,
        id: responseUUID,
        image_urls: imageUrls,
        image_url: imageUrl,
        final_message_response: finalMessageResponse,
        description_response: descriptionResponse,
        memory_response: memoryResponse,
        responder_name: name,
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

interface CharacterSummaryDetails {
  sourcedSummary: Json;
  descriptiveTitle: string;
  summaryOfTraits: string;
  singleWordTraits: string[];
  cardUUID: string;
}
export const insertCharacterSummary = async ({
  sourcedSummary,
  descriptiveTitle,
  summaryOfTraits,
  singleWordTraits,
  cardUUID,
}: CharacterSummaryDetails) => {
  try {
    const { data, error } = await supabaseClient
      .from("Card")
      .update({
        descriptive_title: descriptiveTitle,
        text_summary: summaryOfTraits,
        single_word_traits: singleWordTraits,
        sourced_summary: sourcedSummary,
      })
      .eq("id", cardUUID)
      .select()
      .single();

    if (error) {
      return { ok: false, message: "Error updating character summary" };
    }

    return { ok: true, updatedCard: data };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      message: "There was an error updating the character summary",
    };
  }
};

interface CreateCardDetails {
  birthdayPerson: string;
  birthdayDate: string;
}

type CardRow = Tables<"Card">;
interface CreateCardFunctionResponse extends FunctionResponse {
  ok: true;
  cardId: string;
}

export const createCard = async ({
  birthdayPerson,
  birthdayDate,
}: CreateCardDetails): Promise<
  CreateCardFunctionResponse | FunctionErrorResponse
> => {
  try {
    // First, create a Good_Friend entry
    const { data: goodFriendData, error: goodFriendError } =
      await supabaseClient
        .from("Good_Friend")
        .insert({
          name: "Default Friend", // Default name since no input is provided
        })
        .select("id")
        .single();

    if (goodFriendError || !goodFriendData) {
      return { ok: false, message: "Failed to create Good_Friend entry" };
    }

    // Then, create the Card entry using the Good_Friend ID
    const { data, error } = await supabaseClient
      .from("Card")
      .insert({
        birthday_person: birthdayPerson,
        birthday_date: birthdayDate,
        one_good_friend_id: goodFriendData.id,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, message: "No data returned from insert" };
    }

    return { ok: true, cardId: data.id };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "There was an error creating the card" };
  }
};
