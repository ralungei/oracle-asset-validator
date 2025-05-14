import {
  AccountTreeOutlined,
  FileCopyOutlined,
  SecurityOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { mockValidationData } from "../mocks/validationMock";
import PinContainer from "./PinContainer";
import ValidationSection from "./ValidationSection";
import ErrorBox from "./ui/ErrorBox";
import QualityResult from "./validation/QualityResult";
import SecurityResult from "./validation/SecurityResult";
import StructureResult from "./validation/StructureResult";
import TemplateResult from "./validation/TemplateResult";

export default function AnalysisResult({ input, filePath }) {
  // const { state } = useValidation();
  const { state } = { state: mockValidationData };

  if (state.status === "idle") return null;
  if (state.status === "error")
    return (
      <ErrorBox sx={{ mt: 1 }}>
        {state.error || "An error occurred during validation."}
      </ErrorBox>
    );

  const { level, structure, template, security, quality } = state;

  return (
    <Box sx={{ display: "flex", width: "100%", gap: 2, pb: 6, pt: 2 }}>
      <Box sx={{ flex: "5 1 0%" }}>
        <ValidationSection
          title="Structure Validation"
          isLoading={structure.status === "pending"}
          icon={<AccountTreeOutlined />}
          passed={structure.valid}
          issuesCount={structure.issues?.length || 0}
          recommendationsCount={structure.recommendations?.length || 0}
          renderContent={() => (
            <StructureResult
              structure={structure}
              level={level}
              input={input}
              filePath={filePath}
            />
          )}
        />
        <Box mt={2}>
          <ValidationSection
            title="Template Validation"
            isLoading={template.status === "pending"}
            icon={<FileCopyOutlined />}
            passed={template.valid}
            issuesCount={template.issues?.length || 0}
            recommendationsCount={template.recommendations?.length || 0}
            renderContent={() => <TemplateResult template={template} />}
          />
        </Box>
      </Box>

      <Box
        sx={{
          flex: "2 1 0%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <PinContainer content={input} type={level?.data?.type} />
      </Box>

      <Box sx={{ flex: "5 1 0%" }}>
        <ValidationSection
          title="Security Validation"
          isLoading={security.status === "pending"}
          icon={<SecurityOutlined />}
          passed={security.hasSecurity}
          issuesCount={
            security.criticalIssues.length +
            security.highIssues.length +
            security.mediumIssues.length +
            security.lowIssues.length
          }
          renderContent={() => <SecurityResult security={security} />}
        />
        <Box mt={2}>
          <ValidationSection
            title="Quality Check"
            isLoading={quality.status === "pending"}
            icon={<VerifiedOutlined />}
            passed={quality.qualityScore >= 8}
            issuesCount={quality.issues?.length || 0}
            recommendationsCount={quality.recommendations?.length || 0}
            renderContent={() => <QualityResult quality={quality} />}
          />
        </Box>
      </Box>
    </Box>
  );
}
