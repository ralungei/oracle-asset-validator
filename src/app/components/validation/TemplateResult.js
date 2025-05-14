import CollapsibleList from "../ui/CollapsibleList";

export default function TemplateResult({ template }) {
  return (
    <>
      {template.issues?.length > 0 && (
        <CollapsibleList
          title="Issues"
          items={template.issues}
          severity="error"
        />
      )}

      {template.recommendations?.length > 0 && (
        <CollapsibleList
          title="Recommendations"
          items={template.recommendations}
          severity="warning"
        />
      )}
    </>
  );
}
