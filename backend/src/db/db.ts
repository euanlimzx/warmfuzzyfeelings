import supabaseClient from "./client";

export const createCardFormResponse = async (
  responseUUID,
  imageUrl,
  questionAndResponse,
) => {
  try {
    const createdCard = await supabaseClient
      .from("Card_Form_Response")
      .insert({
        card_id: "123",
        id: responseUUID,
        image_url: imageUrl,
        question_and_response: questionAndResponse,
      })
      .select();

    return { ok: true, createdCard };
  } catch (err) {
    console.error(err);
  }
};
