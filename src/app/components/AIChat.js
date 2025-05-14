"use client";

import {
  AccountTreeRounded,
  AssessmentRounded,
  CheckCircle,
  Error as ErrorIcon,
  FileCopyRounded,
  Rule,
  SecurityRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useGitHubValidator } from "../hooks/useGitHubValidator";
import AnalysisResult from "./AnalysisResult";
import SemicircularProgress from "./DoneHeartIndicator";
import FancyButton from "./FancyButton";

export default function AIChat() {
  const WIDTH_IDLE = 450;
  const WIDTH_EXP = 800;
  const WIDTH_COMPACT = 450;
  const WIDTH_RESULT = 450;
  const ROWS_IDLE = 2;
  const ROWS_EXP = 20;

  const { validate, validationState, resetValidation } = useGitHubValidator();
  const { status, overallResult } = validationState;

  const [loadingContent, setLoadingContent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");
  const [filePath, setFilePath] = useState("");
  const [repoFilePath, setRepoFilePath] = useState("");

  const [response, setResponse] = useState("");
  const [expanded, setExpanded] = useState(false);
  const isSubmitting = useRef(false);

  const computeRadius = () => (loading || response ? 40 : expanded ? 20 : 32);
  const computeWidth = () => {
    if (loading) return WIDTH_COMPACT;
    if (response) return WIDTH_RESULT;
    return expanded ? WIDTH_EXP : WIDTH_IDLE;
  };

  const fieldHeight = expanded
    ? `${ROWS_EXP * 24 + 14}px`
    : `${ROWS_IDLE * 24 + 32}px`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !filePath.trim()) return;
    isSubmitting.current = true;
    setLoading(true);
    try {
      const pathToValidate = repoFilePath || filePath || "not provided";
      const result = await validate(pathToValidate, input);
      setResponse(result.success ? "Validation complete" : result.error);
    } catch {
      setResponse("Error inesperado");
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const handleNew = () => {
    setInput("");
    setFilePath("");
    setRepoFilePath("");
    setResponse("");
    setExpanded(false);
    resetValidation();
  };

  const handleFilePathChange = async (e) => {
    const url = e.target.value;
    setFilePath(url);
    setRepoFilePath("");

    if (url.includes("github.com") && url.includes("/blob/")) {
      setInput("");
      setExpanded(false);
      setLoadingContent(true);

      try {
        const content = await fetchGitHubContent(url);
        if (content) {
          setInput(content);
          setExpanded(true);
        }
      } finally {
        setLoadingContent(false);
      }
    }
  };

  const containerVariants = {
    initial: {
      width: WIDTH_IDLE,
      borderRadius: computeRadius(),
    },
    animate: {
      width: computeWidth(),
      borderRadius: computeRadius(),
    },
  };

  const fetchGitHubContent = async (url) => {
    try {
      const githubRegex =
        /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/;
      const match = url.match(githubRegex);

      if (!match) {
        throw new Error("URL de GitHub no válida");
      }

      const [, owner, repo, branch, path] = match;

      const fullRepoFilePath = `${repo}/${path}`;
      setRepoFilePath(fullRepoFilePath);

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("No se pudo obtener el contenido del archivo");
      }

      const data = await response.json();

      const content = atob(data.content);

      return content;
    } catch (error) {
      console.error("Error fetching GitHub content:", error);
      return null;
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={containerVariants}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              background: "rgba(0, 0, 0, 1)",
              color: "#fff",
              padding: loading || response ? 10 : 20,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 3,
                mb: loading || response ? 0 : 2,
                alignItems: loading || response ? "center" : "flex-start",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    mr: 1.5,
                    bgcolor: (t) =>
                      status === "complete" && overallResult === "pass"
                        ? alpha(t.palette.success.main, 0.2)
                        : status === "complete" && overallResult === "fail"
                        ? alpha(t.palette.error.main, 0.2)
                        : alpha(t.palette.primary.main, 0.2),
                    color: (t) =>
                      status === "complete" && overallResult === "pass"
                        ? t.palette.success.main
                        : status === "complete" && overallResult === "fail"
                        ? t.palette.error.main
                        : t.palette.primary.main,
                    width: 44,
                    height: 44,
                  }}
                >
                  {status === "complete" ? (
                    overallResult === "pass" ? (
                      <CheckCircle />
                    ) : (
                      <ErrorIcon />
                    )
                  ) : (
                    <Rule />
                  )}
                </Avatar>
                <Stack direction="column" spacing={-0.1}>
                  <Typography variant="subtitle1">
                    {status === "complete"
                      ? overallResult === "pass"
                        ? "Validation Passed"
                        : "Validation Failed"
                      : status === "in_progress"
                      ? "Validation in Progress"
                      : "Oracle Asset Validator"}
                  </Typography>
                  {status === "idle" && !loading && !response && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#9A9A9A", lineHeight: 1.2 }}
                    >
                      Validate with Alex Hodicke&apos;s
                      <br />
                      template.
                    </Typography>
                  )}
                </Stack>
              </Box>
              <AnimatePresence initial={false} exitBeforeEnter>
                {loading && (
                  <motion.div
                    key="loader"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{
                      scale: 0,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      },
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CircularProgress
                      size={30}
                      thickness={6}
                      sx={{
                        color: "#fff",
                        mr: 0.6,
                        "& circle": {
                          strokeLinecap: "round",
                        },
                      }}
                    />
                  </motion.div>
                )}
                {!loading && response && (
                  <motion.div
                    key="new"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{
                      scale: 0,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      },
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <FancyButton
                      type="submit"
                      variant="contained"
                      disabled={!input.trim() || loadingContent}
                      onClick={handleNew}
                      sx={{ textTransform: "none", mr: 0.6 }}
                    >
                      New validation
                    </FancyButton>
                  </motion.div>
                )}
                {!loading && !response && (
                  <motion.div
                    key="btn"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{
                      scale: 0,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      },
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <FancyButton
                      type="submit"
                      variant="contained"
                      disabled={!input.trim() || loadingContent}
                      sx={{ textTransform: "none" }}
                    >
                      Validate
                    </FancyButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            {!loading && !response && (
              <TextField
                fullWidth
                placeholder="Enter GitHub URL (e.g., https://github.com/username/repo/blob/main/path/to/file.md)"
                variant="outlined"
                size="small"
                value={filePath}
                onChange={handleFilePathChange}
                InputProps={{
                  sx: {
                    background: "#272727",
                    borderRadius: "16px",
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  },
                  endAdornment: loadingContent && (
                    <CircularProgress
                      size={20}
                      thickness={5}
                      sx={{ color: "#fff" }}
                    />
                  ),
                }}
              />
            )}
            <AnimatePresence initial={false}>
              {!loading && !response && (
                <motion.div
                  key="field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: fieldHeight }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: { type: "spring", stiffness: 600, damping: 50 },
                  }}
                  transition={{ type: "spring", stiffness: 600, damping: 50 }}
                  style={{ overflow: "hidden", marginTop: 12 }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={expanded ? ROWS_EXP : ROWS_IDLE}
                    placeholder="Paste your file content here (README.md, code, LICENSE, etc.)"
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setExpanded(true)}
                    onBlur={() => {
                      if (!input.trim()) setExpanded(false);
                    }}
                    InputProps={{
                      sx: {
                        background: "#272727",
                        borderRadius: "16px",
                        color: "white",
                        border: "none",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      },
                    }}
                  />
                </motion.div>
              )}
              <AnimatePresence initial={false}>
                {!loading && !response && (
                  <motion.div
                    key="indicators"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      height: 0,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: 0.1,
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <Box
                      component={motion.div}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 3,
                        alignItems: "flex-start",
                        gap: expanded ? "24px" : "12px", // Incluir el gap aquí
                      }}
                      animate={{
                        gap: expanded ? "112px" : "12px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <Box>
                        <SemicircularProgress
                          value={30}
                          color="#8E8E93" // Gris
                          icon={<AssessmentRounded />}
                          bottomText="Level"
                        />
                      </Box>
                      <Box sx={{ mt: 4 }}>
                        <SemicircularProgress
                          value={100}
                          color="#34C759"
                          icon={<VerifiedRounded />}
                          bottomText="Quality"
                        />
                      </Box>
                      <Box sx={{ mt: 0 }}>
                        <SemicircularProgress
                          value={70}
                          color="#FF3B30" // Rojo
                          icon={<SecurityRounded />}
                          bottomText="Security"
                        />
                      </Box>
                      <Box sx={{ mt: 4 }}>
                        <SemicircularProgress
                          value={validationState.structure.score || 30}
                          color="#007AFF" // Verde
                          icon={<AccountTreeRounded />}
                          bottomText="Structure"
                        />
                      </Box>
                      <Box sx={{ mt: 0 }}>
                        <SemicircularProgress
                          value={validationState.template.score || 90}
                          color="#FFD60A" // Morado
                          icon={<FileCopyRounded />}
                          bottomText="Template"
                        />
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatePresence>
          </motion.div>
        </form>
      </Box>

      <AnimatePresence>
        {(loading || response) && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{
              height: "calc(100vh - 120px)",
              width: "100%",
              opacity: 1,
              marginTop: 16,
            }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AnalysisResult input={input} filePath={repoFilePath || filePath} />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
