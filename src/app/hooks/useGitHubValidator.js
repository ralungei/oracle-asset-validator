"use client";

import { queryOracleAI } from "@/services/oracleAIService";
import { useCallback } from "react";
import {
  buildErrorResponse,
  loadAllPrompts,
  looksLikeJson,
  preparePrompt,
  processJsonResponse,
} from "../../utils/promptUtils";
import { useValidation } from "../contexts/ValidationContext";

export function useGitHubValidator() {
  const {
    state,
    startValidation,
    completeValidation,
    setValidationError,
    setLevelResult,
    setStructureResult,
    setTemplateResult,
    setSecurityResult,
    setQualityResult,
    resetValidation,
  } = useValidation();

  const detectLevel = useCallback(
    async (filePath) => {
      try {
        const promptContent = await preparePrompt("level_detector_prompt", {
          filePath,
        });

        const response = await queryOracleAI(promptContent);

        console.log("Response: ", response);

        if (!response.success) {
          throw new Error(response.error || "Failed to detect level");
        }

        const text =
          response.data.chatResult.chatResponse.choices[0].message.content[0]
            .text;

        if (!looksLikeJson(text)) {
          throw new Error("Response is not in expected JSON format");
        }

        const levelData = processJsonResponse(text);

        setLevelResult(levelData);
        return levelData;
      } catch (error) {
        console.error("Level detection error:", error);
        const fallbackData = processJsonResponse(
          buildErrorResponse("level_detector_prompt", error.message)
        );
        setLevelResult(fallbackData);
        return fallbackData;
      }
    },
    [setLevelResult]
  );

  const validateStructure = useCallback(
    async (filePath, level) => {
      try {
        const promptContent = await preparePrompt(
          "structure_validator_prompt",
          {
            filePath,
            level: level.level,
            type: level.type,
          }
        );

        const response = await queryOracleAI(promptContent);

        if (!response.success) {
          throw new Error(response.error || "Failed to validate structure");
        }

        const text =
          response.data.chatResult.chatResponse.choices[0].message.content[0]
            .text;

        if (!looksLikeJson(text)) {
          throw new Error("Response is not in expected JSON format");
        }

        const { issues, recommendations, valid } = processJsonResponse(text);

        setStructureResult(issues, recommendations, valid);
        return { issues, recommendations, valid };
      } catch (error) {
        console.error("Structure validation error:", error);
        const { issues, recommendations, valid } = processJsonResponse(
          buildErrorResponse("structure_validator_prompt", error.message)
        );
        setStructureResult(issues, recommendations, valid);
        return { issues, recommendations, valid: false };
      }
    },
    [setStructureResult]
  );

  const validateTemplate = useCallback(
    async (filePath, content, level) => {
      try {
        const promptContent = await preparePrompt("template_validator_prompt", {
          filePath,
          content,
          level: level.level,
          type: level.type,
        });

        const response = await queryOracleAI(promptContent);

        if (!response.success) {
          throw new Error(response.error || "Failed to validate template");
        }

        const text =
          response.data.chatResult.chatResponse.choices[0].message.content[0]
            .text;

        console.log("text is: ", text);

        if (!looksLikeJson(text)) {
          throw new Error("Response is not in expected JSON format");
        }

        const { issues, recommendations, valid } = processJsonResponse(text);

        setTemplateResult(issues, recommendations, valid);
        return { issues, recommendations, valid };
      } catch (error) {
        console.error("Template validation error:", error);
        const { issues, recommendations, valid } = processJsonResponse(
          buildErrorResponse("template_validator_prompt", error.message)
        );
        setTemplateResult(issues, recommendations, valid);
        return { issues, recommendations, valid: false };
      }
    },
    [setTemplateResult]
  );

  const validateSecurity = useCallback(
    async (filePath, content) => {
      try {
        const promptContent = await preparePrompt("security_scanner_prompt", {
          filePath,
          content,
        });

        const response = await queryOracleAI(promptContent);

        if (!response.success) {
          throw new Error(response.error || "Failed to validate security");
        }

        const text =
          response.data.chatResult.chatResponse.choices[0].message.content[0]
            .text;

        if (!looksLikeJson(text)) {
          throw new Error("Response is not in expected JSON format");
        }

        const {
          criticalIssues,
          highIssues,
          mediumIssues,
          lowIssues,
          hasSecurity,
        } = processJsonResponse(text);

        setSecurityResult(
          criticalIssues,
          highIssues,
          mediumIssues,
          lowIssues,
          hasSecurity
        );
        return {
          criticalIssues,
          highIssues,
          mediumIssues,
          lowIssues,
          hasSecurity,
        };
      } catch (error) {
        console.error("Security validation error:", error);
        const {
          criticalIssues,
          highIssues,
          mediumIssues,
          lowIssues,
          hasSecurity,
        } = processJsonResponse(
          buildErrorResponse("security_scanner_prompt", error.message)
        );
        setSecurityResult(
          criticalIssues,
          highIssues,
          mediumIssues,
          lowIssues,
          true
        );
        return {
          criticalIssues,
          highIssues,
          mediumIssues,
          lowIssues,
          hasSecurity: true,
        };
      }
    },
    [setSecurityResult]
  );

  const validateQuality = useCallback(
    async (content) => {
      try {
        const promptContent = await preparePrompt("quality_checker_prompt", {
          content,
        });

        const response = await queryOracleAI(promptContent);

        if (!response.success) {
          throw new Error(response.error || "Failed to validate quality");
        }

        const text =
          response.data.chatResult.chatResponse.choices[0].message.content[0]
            .text;

        if (!looksLikeJson(text)) {
          throw new Error("Response is not in expected JSON format");
        }

        const { issues, recommendations, qualityScore } =
          processJsonResponse(text);

        setQualityResult(issues, recommendations, qualityScore);
        return { issues, recommendations, qualityScore };
      } catch (error) {
        console.error("Quality validation error:", error);
        const { issues, recommendations, qualityScore } = processJsonResponse(
          buildErrorResponse("quality_checker_prompt", error.message)
        );
        setQualityResult(issues, recommendations, 1);
        return { issues, recommendations, qualityScore: 1 };
      }
    },
    [setQualityResult]
  );

  const checkPromptsAvailable = useCallback(async () => {
    try {
      await loadAllPrompts();
      return true;
    } catch (error) {
      console.error("Prompts check failed:", error);
      setValidationError(`Required prompts missing: ${error.message}`);
      return false;
    }
  }, [setValidationError]);

  const validate = useCallback(
    async (filePath, content) => {
      try {
        const promptsAvailable = await checkPromptsAvailable();
        if (!promptsAvailable) {
          return {
            success: false,
            error:
              "Cannot proceed with validation. Required prompts are missing.",
          };
        }

        resetValidation();
        startValidation();

        const level = await detectLevel(filePath);

        const validationPromises = [
          validateStructure(filePath, level),
          validateTemplate(filePath, content, level),
          validateSecurity(filePath, content),
          validateQuality(content),
        ];

        const results = await Promise.allSettled(validationPromises);

        const hasFailures = determineOverallResult(state, results);
        const overallResult = hasFailures ? "fail" : "pass";

        completeValidation(overallResult);
        return { success: true, state };
      } catch (error) {
        console.error("Validation process error:", error);
        setValidationError(error.message);
        return { success: false, error: error.message };
      }
    },
    [
      checkPromptsAvailable,
      startValidation,
      detectLevel,
      validateStructure,
      validateTemplate,
      validateSecurity,
      validateQuality,
      completeValidation,
      resetValidation,
      setValidationError,
      state,
    ]
  );

  return {
    validationState: state,
    validate,
    resetValidation,
  };
}

function determineOverallResult(state, results) {
  const structureResult =
    results[0].status === "fulfilled" ? results[0].value : { valid: false };
  const templateResult =
    results[1].status === "fulfilled" ? results[1].value : { valid: false };
  const securityResult =
    results[2].status === "fulfilled"
      ? results[2].value
      : { hasSecurity: true };

  const hasStructureIssues = !structureResult.valid;
  const hasTemplateIssues = !templateResult.valid;
  const hasSecurityIssues = securityResult.hasSecurity;

  return hasStructureIssues || hasTemplateIssues || hasSecurityIssues;
}
