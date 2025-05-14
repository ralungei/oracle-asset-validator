/**
 * Service to interact with the Oracle AI API endpoint
 */
export async function queryOracleAI(inputText) {
  try {
    const response = await fetch("/api/oracle-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: inputText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get response");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in oracleAIService:", error);
    throw error;
  }
}
