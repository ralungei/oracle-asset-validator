import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const PinContainer = ({ content, type }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showRay, setShowRay] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsAnimated(true), 500);
    const timer2 = setTimeout(() => setShowRay(true), 1200);
    const timer3 = setTimeout(() => setShowButton(true), 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        mt: 12,
        zIndex: 50,
      }}
    >
      {/* Card Component */}
      <Box
        sx={{
          perspective: "1000px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            p: 2,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            borderRadius: 2,
            boxShadow: isHovered
              ? "0 12px 24px rgba(0,0,0,0.5), 0 0 10px rgba(6,182,212,0.1)"
              : "0 8px 16px rgba(0,0,0,0.4)",
            backgroundColor: "#000",
            border: isAnimated
              ? isHovered
                ? "1px solid rgba(6,182,212,0.3)"
                : "1px solid rgba(255,255,255,0.2)"
              : "1px solid rgba(255,255,255,0.1)",
            transition: "transform 700ms, border 500ms, box-shadow 500ms",
            overflow: "hidden",
            transform: isAnimated
              ? isHovered
                ? "translate(-50%,-50%) rotateX(25deg) scale(0.85)"
                : "translate(-50%,-50%) rotateX(40deg) scale(0.8)"
              : "translate(-50%,-50%) rotateX(0) scale(1)",
            transformOrigin: "center center",
          }}
        >
          <Box
            sx={{ width: 170, height: 260, color: "white", overflow: "hidden" }}
          >
            <Typography
              sx={{
                fontSize: "9.6px",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 18,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "monospace",
                letterSpacing: 0.05,
              }}
            >
              {content ||
                "This is a recreation of the pin effect using React and MUI. The animation occurs automatically once and stays in the final position. Now with enhanced hover effects on the ray, circle, and button."}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Pin Indicator Component */}
      <Box
        sx={{
          pointerEvents: "none",
          width: "100%",
          aspectRatio: "384/320",
          maxWidth: 384,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isAnimated ? 1 : 0,
          zIndex: 60,
          transition: "opacity 500ms",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "translateY(-15%)",
          }}
        >
          {/* Title Button */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "auto", // Allow button interactions
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                borderRadius: "9999px",
                backgroundColor: isButtonHovered
                  ? "rgba(255,255,255,0.95)"
                  : "#fff",
                px: 2,
                py: 0.25,
                overflow: "hidden",
                transition:
                  "opacity 500ms, transform 300ms, background-color 300ms",
                opacity: showButton ? 1 : 0,
                transform: isButtonHovered
                  ? "translateY(-2px)"
                  : "translateY(0)",
                boxShadow: isButtonHovered
                  ? "0 2px 8px rgba(6,182,212,0.5)"
                  : "none",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 12,
                  transition: "transform 300ms",
                  transform: isButtonHovered ? "scale(1.05)" : "scale(1)",
                }}
              >
                {type?.toUpperCase()}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "9px",
                  height: "1px",
                  width: "calc(100% - 18px)",
                  background: isButtonHovered
                    ? "linear-gradient(to right, rgba(6,182,212,0), rgba(6,182,212,1), rgba(6,182,212,0))"
                    : "linear-gradient(to right, rgba(6,182,212,0), rgba(6,182,212,0.7), rgba(6,182,212,0))",
                  boxShadow: showRay
                    ? isButtonHovered
                      ? "0 0 12px rgba(6,182,212,0.9)"
                      : "0 0 10px rgba(6,182,212,0.7)"
                    : "none",
                  opacity: showRay ? (isButtonHovered ? 0.9 : 0.6) : 0,
                  transition:
                    "opacity 500ms, box-shadow 800ms, background 300ms",
                }}
              />
            </Box>
          </Box>

          {/* Ray - Blurred */}
          <Box
            sx={{
              position: "absolute",
              right: "50%",
              bottom: "33%",
              background:
                "linear-gradient(to bottom, transparent,rgba(6, 181, 212, 0.78))",
              transform: "translateY(14px)",
              width: isHovered ? "1.5px" : "1px",
              height: showRay ? 160 : 0,
              transition: "height 1s ease-out, width 300ms, opacity 300ms",
              filter: isHovered ? "blur(3px)" : "blur(2px)",
              opacity: isHovered ? 0.9 : 0.7,
            }}
          />

          {/* Ray - Sharp */}
          <Box
            sx={{
              position: "absolute",
              right: "50%",
              bottom: "33%",
              background: isHovered
                ? "linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.9))"
                : "linear-gradient(to bottom, transparent, #06b6d4)",
              transform: "translateY(14px)",
              width: "1px",
              height: showRay ? 160 : 0,
              transition: "height 1s ease-out, background 300ms",
            }}
          />

          {/* Ray point */}
          <Box
            sx={{
              position: "absolute",
              right: "calc(50% - 2px)",
              bottom: "calc(32% - 5px)",
              transform: "translateY(14px)",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: isHovered ? "#08d6f6" : "#06b6d4",
              boxShadow: isHovered
                ? "0 0 8px 4px rgba(6, 182, 212, 0.5), 0 0 16px 2px rgba(6, 182, 212, 0.3)"
                : "0 0 4px 2px rgba(6, 182, 212, 0.2)",
              opacity: showRay ? 1 : 0,
              transition:
                "opacity 1s ease-out, width 300ms, height 300ms, background-color 300ms, box-shadow 300ms",
              zIndex: 9,
            }}
          />

          {/* Ray light effect */}

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              bottom: "8%",
              background: "rgba(255, 255, 255, 0.2)",
              transform: isHovered
                ? "translate(-50%,-50%) rotateX(40deg) scale(1.1)" // Añadido scale(1.2)
                : "translate(-50%,-50%) rotateX(52deg)",
              width: 40,
              height: 40,
              borderRadius: "50%",

              boxShadow: isHovered
                ? "0 4px 4px 4px rgba(0, 0, 0, 0.56), inset 0 0 10px rgba(255,255,255,0.55)"
                : "0 4px 4px 4px rgba(0, 0, 0, 0.86), inset 0 0 10px rgba(255,255,255,0.55)",
              opacity: showRay ? (isHovered ? 1 : 0.9) : 0,
              transition:
                "opacity 0.8s ease-out, width 300ms, height 300ms, box-shadow 300ms, background 300ms, transform 400ms ease-out",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              bottom: "-10.5%",
              background: "rgba(255, 255, 255, 0.1)",
              transform: isHovered
                ? "translate(-50%,-50%) rotateX(40deg) scale(1.05)"
                : "translate(-50%,-50%) rotateX(52deg)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              boxShadow: isHovered
                ? "0 4px 4px 4px rgba(0, 0, 0, 0.56), inset 0 0 10px rgba(255,255,255,0.55)"
                : "0 4px 4px 4px rgba(0, 0, 0, 0.86), inset 0 0 10px rgba(255,255,255,0.55)",
              opacity: showRay ? (isHovered ? 1 : 0.9) : 0,
              transition:
                "opacity 0.8s ease-out, width 300ms, height 300ms, box-shadow 300ms, background 300ms, transform 400ms ease-out",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PinContainer;
