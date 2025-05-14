import {
  Circle,
  Error as ErrorIcon,
  ExpandLess,
  ExpandMore,
  Info,
  NewReleases,
  Shield,
  Warning,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function CollapsibleList({ title, items, severity = "error" }) {
  const [expanded, setExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  const getSeverityStyle = () => {
    switch (severity) {
      case "critical":
        return {
          color: "#FF453A",
          iconColor: "#FF453A",
          bgColor: "rgba(255, 69, 58, 0.08)",
          borderColor: "rgba(255, 69, 58, 0.15)",
        };
      case "error":
        return {
          color: "#FF3B30",
          iconColor: "#FF3B30",
          bgColor: "rgba(255, 59, 48, 0.06)",
          borderColor: "rgba(255, 59, 48, 0.12)",
        };
      case "warning":
        return {
          color: "#FF9F0A",
          iconColor: "#FF9F0A",
          bgColor: "rgba(255, 159, 10, 0.06)",
          borderColor: "rgba(255, 159, 10, 0.12)",
        };
      case "info":
        return {
          color: "#007AFF",
          iconColor: "#007AFF",
          bgColor: "rgba(0, 122, 255, 0.05)",
          borderColor: "rgba(0, 122, 255, 0.12)",
        };
      case "success":
        return {
          color: "#34C759",
          iconColor: "#34C759",
          bgColor: "rgba(52, 199, 89, 0.05)",
          borderColor: "rgba(52, 199, 89, 0.12)",
        };
      default:
        return {
          color: "#8E8E93",
          iconColor: "#8E8E93",
          bgColor: "rgba(142, 142, 147, 0.05)",
          borderColor: "rgba(142, 142, 147, 0.12)",
        };
    }
  };

  const getIcon = () => {
    const style = getSeverityStyle();
    const iconSize = 18;

    const iconWrapper = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: style.bgColor,
      border: `1px solid ${style.borderColor}`,
      transition: "all 0.2s ease",
    };

    switch (severity) {
      case "critical":
        return (
          <Box sx={iconWrapper}>
            <NewReleases sx={{ fontSize: iconSize, color: style.iconColor }} />
          </Box>
        );
      case "error":
        return (
          <Box sx={iconWrapper}>
            <ErrorIcon sx={{ fontSize: iconSize, color: style.iconColor }} />
          </Box>
        );
      case "warning":
        return (
          <Box sx={iconWrapper}>
            <Warning sx={{ fontSize: iconSize, color: style.iconColor }} />
          </Box>
        );
      case "success":
        return (
          <Box sx={iconWrapper}>
            <Shield sx={{ fontSize: iconSize, color: style.iconColor }} />
          </Box>
        );
      default:
        return (
          <Box sx={iconWrapper}>
            <Info sx={{ fontSize: iconSize, color: style.iconColor }} />
          </Box>
        );
    }
  };

  const style = getSeverityStyle();

  const getItemDecoratorIcon = () => {
    return <Circle sx={{ fontSize: 6, color: style.color, opacity: 0.6 }} />;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          position: "relative",
          backgroundColor: expanded ? style.bgColor : "transparent",
          border: expanded
            ? `1px solid ${style.borderColor}`
            : "1px solid transparent",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.01)",
            },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {getIcon()}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                color: style.color,
                letterSpacing: "-0.01em",
              }}
            >
              {title} ({items.length})
            </Typography>
          </Box>
          {expanded ? (
            <ExpandLess
              fontSize="small"
              sx={{
                color: style.color,
                opacity: 0.6,
                transition: "transform 0.2s ease",
                transform: "translateY(0)",
              }}
            />
          ) : (
            <ExpandMore
              fontSize="small"
              sx={{
                color: style.color,
                opacity: 0.6,
                transition: "transform 0.2s ease",
                transform: "translateY(0)",
              }}
            />
          )}
        </Box>

        <Collapse in={expanded}>
          <List
            dense
            disablePadding
            sx={{
              mx: 1.5,
              mb: 1.5,
              borderRadius: 1,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
            }}
          >
            {items.map((item, i) => (
              <ListItem
                key={i}
                sx={{
                  py: 0.75,
                  borderBottom:
                    i < items.length - 1
                      ? "1px solid rgba(0,0,0,0.03)"
                      : "none",
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {getItemDecoratorIcon()}
                </ListItemIcon>
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontSize: 13,
                    fontWeight: 400,
                    color: "rgba(0, 0, 0, 0.75)",
                    lineHeight: 1.5,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>
    </Box>
  );
}
