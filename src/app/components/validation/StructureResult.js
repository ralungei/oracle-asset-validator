import CollapsibleList from "../ui/CollapsibleList";

export default function StructureResult({ structure, level, input, filePath }) {
  return (
    <>
      {structure.issues?.length > 0 && (
        <CollapsibleList
          title="Issues"
          items={structure.issues}
          severity="error"
        />
      )}

      {structure.recommendations?.length > 0 && (
        <CollapsibleList
          title="Recommendations"
          items={structure.recommendations}
          severity="warning"
        />
      )}
    </>
  );
}
