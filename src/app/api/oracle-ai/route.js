import fs from "fs";
import {
  NoRetryConfigurationDetails,
  SimpleAuthenticationDetailsProvider,
} from "oci-common";
import { GenerativeAiInferenceClient } from "oci-generativeaiinference";

export async function POST(req) {
  try {
    const { input } = await req.json();

    // Leer la clave privada desde el archivo
    const privateKey = fs.readFileSync(
      process.env.ORACLE_PRIVATE_KEY_PATH,
      "utf8"
    );

    // Configuramos la autenticación directamente con SimpleAuthenticationDetailsProvider
    const provider = new SimpleAuthenticationDetailsProvider(
      process.env.ORACLE_TENANCY_ID,
      process.env.ORACLE_USER_ID,
      process.env.ORACLE_FINGERPRINT,
      privateKey,
      null, // passphrase, normalmente null
      null
    );

    // El resto del código es igual...
    const client = new GenerativeAiInferenceClient({
      authenticationDetailsProvider: provider,
    });

    // Sets the endpoint of the service
    client.endpoint = process.env.ORACLE_ENDPOINT;

    // On Demand Serving Mode
    const servingMode = {
      modelId: process.env.ORACLE_MODEL_ID,
      servingType: "ON_DEMAND",
    };

    // Chat Details
    const chatRequest = {
      chatDetails: {
        compartmentId: process.env.ORACLE_COMPARTMENT_ID,
        servingMode: servingMode,
        chatRequest: {
          messages: [
            {
              role: "USER",
              content: [
                {
                  type: "TEXT",
                  text: input,
                },
              ],
            },
          ],
          apiFormat: "GENERIC",
          maxTokens: 600,
          temperature: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
          topP: 0.75,
        },
      },
      retryConfiguration: NoRetryConfigurationDetails,
    };

    const chatResponse = await client.chat(chatRequest);

    // Return the complete response structure without modifying it
    // This ensures the client side can access the correct paths
    return Response.json({
      success: true,
      data: chatResponse,
    });
  } catch (error) {
    console.error("Error calling Oracle AI:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to get response from Oracle AI",
      },
      { status: 500 }
    );
  }
}
