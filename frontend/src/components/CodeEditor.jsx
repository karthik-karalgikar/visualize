import { Box, Text, ScrollArea } from "@mantine/core";
import { Play, AlertCircle } from "./icons";
import { useEffect, useRef } from "react";

export default function CodeEditor({
  code,
  setCode,
  runCode,
  isRunning,
  error,
  executionLog,
  currentStep,
  currentStepData,
}) {
  const codeLines = code.split("\n");
  const lineRefs = useRef({});

  const isExecutionMode = executionLog.length > 0;

  // Auto-scroll to current line
  useEffect(() => {
    if (currentStepData?.lineno && lineRefs.current[currentStepData.lineno]) {
      lineRefs.current[currentStepData.lineno].scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [currentStepData]);

  return (
    <Box h="100%" p="md" bg="dark.8" borderRadius="md">
      {/* HEADER */}
      <Box mb="sm">
        <Text fw={600} c="gray.0">
          Code Editor
        </Text>
        <Text size="xs" c="gray.5">
          Python 3 • Execution-aware
        </Text>
      </Box>

      {/* CODE VIEW */}
      <Box
        h="calc(100% - 96px)"
        bg="dark.9"
        style={{
          border: "1px solid #262626",
          borderRadius: 8,
        }}
      >
        {isExecutionMode ? (
          <ScrollArea h="100%" px="sm">
            {codeLines.map((line, idx) => {
              const lineNo = idx + 1;

              const isCurrent =
                currentStepData?.event === "line" &&
                currentStepData.lineno === lineNo;

              const isExecuted = executionLog.some(
                (step, stepIdx) =>
                  step.lineno === lineNo && stepIdx <= currentStep
              );

              return (
                <Box
                  key={idx}
                  ref={(el) => (lineRefs.current[lineNo] = el)}
                  px="xs"
                  py={2}
                  style={{
                    backgroundColor: isCurrent
                      ? "#facc15"
                      : isExecuted
                      ? "rgba(34,197,94,0.15)"
                      : "transparent",
                    color: isCurrent
                      ? "#000"
                      : isExecuted
                      ? "#86efac"
                      : "#6b7280",
                    fontFamily: "monospace",
                    fontSize: 13,
                    borderRadius: 4,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 32,
                      textAlign: "right",
                      marginRight: 12,
                      color: "#525252",
                      userSelect: "none",
                    }}
                  >
                    {lineNo}
                  </span>
                  {line || " "}
                </Box>
              );
            })}
          </ScrollArea>
        ) : (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              width: "100%",
              height: "100%",
              resize: "none",
              background: "transparent",
              border: "none",
              outline: "none",
              padding: 12,
              fontFamily: "monospace",
              fontSize: 13,
              color: "#4ade80",
            }}
            placeholder="Enter your Python code here..."
          />
        )}
      </Box>

      {/* RUN BUTTON */}

      <Box mt="sm">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-md flex items-center justify-center gap-2"
        >
          <Play />
          {isRunning ? "Executing..." : "Run & Visualize"}
        </button>
      </Box>

      {/* ERROR */}
      {error && (
        <Box
          mt="sm"
          p="sm"
          bg="rgba(239,68,68,0.15)"
          style={{
            border: "1px solid #ef4444",
            borderRadius: 6,
          }}
        >
          <Text size="xs" c="red.3" fw={600}>
            Error
          </Text>
          <Text size="xs" c="red.2" ff="monospace">
            {error}
          </Text>
        </Box>
      )}
    </Box>
  );
}
