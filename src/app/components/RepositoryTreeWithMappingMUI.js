import { TrendingFlat } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

// -------------------------------------
// Configuración de colores (ajústalos aquí)
// -------------------------------------
const colors = {
  iconHighlighted: "#4F46E5", // color de iconos destacados
  iconDefault: "#9CA3AF", // color de iconos por defecto
  textHighlighted: "#4F46E5", // color de texto destacado
  textDefault: "#000", // color de texto por defecto
  specificDefault: "#6B7280", // color de texto “specific” por defecto
  arrow: "#4F46E5", // color de la flecha TrendingFlat
};

const RepositoryTree = ({ filePath }) => {
  const parts = filePath.split("/").filter((p) => p !== "");
  const last = parts[parts.length - 1];
  const isReadme = last === "README.md";
  const isLicense = last === "LICENSE";

  const staticLevels = [
    { name: "Area", specific: parts[0] || "" },
    { name: "Specialism", specific: parts[1] || "" },
    { name: "Product/Workload", specific: parts[2] || "" },
    { name: "Asset", specific: parts[3] || "" },
    { name: "files", specific: "" },
  ];

  const tree = [];
  staticLevels.forEach((lvl, i) => {
    tree.push({
      type: "folder",
      name: lvl.name,
      level: i,
      specific: lvl.specific,
    });
    if (i < 4) {
      tree.push({ type: "file", name: "README.md", level: i + 1 });
      tree.push({ type: "file", name: "LICENSE", level: i + 1 });
    }
  });

  const filesIndex = parts.indexOf("files");
  if (filesIndex !== -1) {
    parts.slice(filesIndex + 1).forEach((seg, idx, arr) => {
      tree.push({
        type: idx < arr.length - 1 ? "folder" : "file",
        name: seg,
        level: filesIndex + 1 + idx,
      });
    });
  }

  return (
    <Box>
      {tree.map((item, idx) => {
        const { type, name, level, specific } = item;
        const indent = level * 12;
        let isHighlighted = false;
        let specificHighlighted = false;

        // Lógica de resaltado
        if (type === "folder") {
          if (level < 4 && parts[level] === specific && specific) {
            isHighlighted = specificHighlighted = true;
          }
          if (level === 4 && parts[4] === "files") {
            isHighlighted = true;
          }
        }
        if (
          type === "file" &&
          name === "README.md" &&
          isReadme &&
          parts.length - 1 === level
        ) {
          isHighlighted = true;
        }
        if (
          type === "file" &&
          name === "LICENSE" &&
          isLicense &&
          parts.length - 1 === level
        ) {
          isHighlighted = true;
        }
        if (level > 4 && parts[level] === name) {
          isHighlighted = true;
        }

        return (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 0.1,
              minWidth: 300,
            }}
          >
            <Box sx={{ width: indent, flexShrink: 0 }} />

            {/* Icono */}
            <Box
              sx={{
                mr: 0.5,
                color: isHighlighted
                  ? colors.iconHighlighted
                  : colors.iconDefault,
              }}
            >
              {type === "folder" ? (
                <FolderIcon sx={{ fontSize: 14 }} />
              ) : (
                <DescriptionIcon sx={{ fontSize: 14 }} />
              )}
            </Box>

            {/* Nombre */}
            <Typography
              variant="caption"
              sx={{
                color: isHighlighted
                  ? colors.textHighlighted
                  : colors.textDefault,
                fontWeight: isHighlighted ? "bold" : 500,
                lineHeight: 1.2,
              }}
            >
              {name}
            </Typography>

            {/* Flecha y texto específico */}
            {specific && (
              <>
                <Box sx={{ mx: 0.5 }}>
                  <TrendingFlat sx={{ color: colors.arrow }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: specificHighlighted
                      ? colors.iconHighlighted
                      : colors.specificDefault,
                    fontWeight: specificHighlighted ? "bold" : 500,
                    lineHeight: 1.2,
                  }}
                >
                  {specific}
                </Typography>
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

RepositoryTree.propTypes = {
  filePath: PropTypes.string.isRequired,
};

export default RepositoryTree;
