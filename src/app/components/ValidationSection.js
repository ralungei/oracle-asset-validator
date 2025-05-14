"use client";

import { keyframes } from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

const breathe = keyframes`
  0% { box-shadow: 5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff, inset 0 0 0 #d1d1d1, inset 0 0 0 #ffffff; }
  50% { box-shadow: 3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff, inset 1px 1px 3px #d1d1d1, inset -1px -1px 3px #ffffff; }
  100% { box-shadow: 5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff, inset 0 0 0 #d1d1d1, inset 0 0 0 #ffffff; }
`;

const spinGlow = keyframes`
  to { transform: rotate(360deg); }
`;

const appear = keyframes`
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const NeumorphicIcon = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 36,
  height: 36,
  borderRadius: 18,
  background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
  boxShadow:
    "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff, inset 0 0 0 #d1d1d1, inset 0 0 0 #ffffff",
  position: "relative",
  overflow: "visible",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow:
      "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff, inset 2px 2px 5px #d1d1d1, inset -2px -2px 5px #ffffff",
    transform: "translateY(2px)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
    opacity: 0.6,
    zIndex: 1,
  },
  animation: `${breathe} 4s infinite ease-in-out`,
});

const IconWrapper = styled(Box)(({ bg, shadow }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 14,
  background: bg,
  boxShadow: shadow,
  animation: `${appear} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
}));

const ValidationStatus = ({
  issuesCount,
  recommendationsCount,
  isLoading,
  type,
}) => {
  if (isLoading)
    return (
      <CircularProgress
        size={20}
        thickness={6}
        sx={{
          color: "grey",
          mr: 0.5,
          "& circle": {
            strokeLinecap: "round",
          },
        }}
      />
    );

  if (issuesCount > 0) {
    return (
      <IconWrapper
        bg="linear-gradient(145deg, #FF453A 0%, #FF5147 100%)"
        shadow="0 2px 8px rgba(255, 69, 58, 0.25)"
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 16,
            color: "#fff",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
          }}
        />
      </IconWrapper>
    );
  }

  if (
    recommendationsCount > 0 ||
    (type === "Security" && recommendationsCount > 0)
  ) {
    return (
      <IconWrapper
        bg="linear-gradient(145deg, #FF9F0A 0%, #FFB340 100%)"
        shadow="0 2px 8px rgba(255, 159, 10, 0.25)"
      >
        <InfoOutlinedIcon
          sx={{
            fontSize: 16,
            color: "#fff",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
          }}
        />
      </IconWrapper>
    );
  }

  return (
    <IconWrapper
      bg="linear-gradient(145deg, #34C759 0%, #30D158 100%)"
      shadow="0 2px 8px rgba(52, 199, 89, 0.25)"
    >
      <CheckCircleIcon
        sx={{
          fontSize: 16,
          color: "#fff",
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
        }}
      />
    </IconWrapper>
  );
};

const ValidationSection = ({
  title,
  icon,
  passed,
  issuesCount = 0,
  recommendationsCount = 0,
  renderContent,
  type = "default",
  isLoading,
}) => {
  const expanded = (issuesCount > 0 || recommendationsCount > 0) && !isLoading;

  console.log("isLoading", isLoading);

  return (
    <Box
      sx={{
        minWidth: 320,
        borderRadius: 10,
        bgcolor: "rgba(250,250,250,1)",
        backdropFilter: "blur(25px) saturate(180%)",
        boxShadow: expanded
          ? "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)"
          : "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.01)",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        width: "100%",

        flex: "1 1 auto",
        transform: expanded ? "scale(1.01)" : "scale(1)",
        "&:hover": {
          boxShadow: expanded
            ? "0 12px 42px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)"
            : "0 6px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
          transform: expanded ? "scale(1.02)" : "scale(1.005)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {icon && (
            <NeumorphicIcon>
              {React.cloneElement(icon, {
                sx: {
                  fontSize: 18,
                  color: "#6a6a6a",
                  filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.7))",
                  position: "relative",
                  zIndex: 2,
                },
              })}
            </NeumorphicIcon>
          )}
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "rgba(0,0,0,0.85)",
              textShadow: "0 1px 1px rgba(255,255,255,0.5)",
            }}
          >
            {title}
          </Typography>
        </Stack>
        <ValidationStatus
          passed={passed}
          issuesCount={issuesCount}
          recommendationsCount={recommendationsCount}
          isLoading={isLoading}
          type={type}
        />
      </Box>
      {expanded && (
        <Box
          sx={{
            px: 3,
            pt: 0.5,
            pb: 3,
            mt: 0.5,
            pt: 2,
            borderTop: "1px solid rgba(0,0,0,0.04)",
            animation: `${appear} 0.4s cubic-bezier(0.16,1,0.3,1)`,
          }}
        >
          {renderContent()}
        </Box>
      )}
    </Box>
  );
};

export default ValidationSection;
