import { Box } from "@mui/material";
import CollapsibleList from "../ui/CollapsibleList";

export default function SecurityResult({ security }) {
  const hasAnyIssues =
    security.criticalIssues.length > 0 ||
    security.highIssues.length > 0 ||
    security.mediumIssues.length > 0 ||
    security.lowIssues.length > 0;

  if (!hasAnyIssues) {
    return (
      <CollapsibleList
        title="All Security Checks Passed"
        items={["No security issues were found in the code."]}
        severity="success"
      />
    );
  }

  return (
    <Box>
      {security.criticalIssues.length > 0 && (
        <CollapsibleList
          title="Critical Security Issues"
          items={security.criticalIssues}
          severity="critical"
        />
      )}

      {security.highIssues.length > 0 && (
        <CollapsibleList
          title="High Priority Issues"
          items={security.highIssues}
          severity="error"
        />
      )}

      {security.mediumIssues.length > 0 && (
        <CollapsibleList
          title="Medium Priority Issues"
          items={security.mediumIssues}
          severity="warning"
        />
      )}

      {security.lowIssues.length > 0 && (
        <CollapsibleList
          title="Low Priority Issues"
          items={security.lowIssues}
          severity="info"
        />
      )}
    </Box>
  );
}
