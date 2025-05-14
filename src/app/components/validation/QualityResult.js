import { Typography } from "@mui/material";
import CollapsibleList from "../ui/CollapsibleList";

export default function QualityResult({ quality }) {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {quality.qualityScore}/10
      </Typography>

      {quality.issues?.length > 0 && (
        <CollapsibleList
          title="Issues"
          items={quality.issues}
          severity="error"
        />
      )}

      {quality.recommendations?.length > 0 && (
        <CollapsibleList
          title="Recommendations"
          items={quality.recommendations}
          severity="warning"
        />
      )}
    </>
  );
}
