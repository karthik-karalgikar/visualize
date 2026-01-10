import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Play } from "./icons";

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
    <div className="h-full rounded-md bg-neutral-800 p-4">
      {/* HEADER */}
      <div className="mb-2">
        <div className="font-semibold text-gray-100">Code Editor</div>
        <div className="text-xs text-gray-500">Python 3 • Execution-aware</div>
      </div>

      {/* CODE VIEW */}
      <div className="h-[calc(100%-96px)] rounded-lg border border-neutral-800 bg-neutral-900">
        {isExecutionMode ? (
          <ScrollArea className="h-full px-2">
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
                <div
                  key={idx}
                  ref={(el) => (lineRefs.current[lineNo] = el)}
                  className="px-2 py-[2px] rounded text-[13px] font-mono"
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
                  }}
                >
                  <span className="inline-block w-8 text-right mr-3 select-none text-neutral-500">
                    {lineNo}
                  </span>
                  {line || " "}
                </div>
              );
            })}
          </ScrollArea>
        ) : (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-full w-full resize-none bg-transparent border-none outline-none p-3 font-mono text-[13px] text-green-400"
            placeholder="Enter your Python code here..."
          />
        )}
      </div>

      {/* RUN BUTTON */}
      <div className="mt-2">
        <Button
          onClick={runCode}
          disabled={isRunning}
          className="w-full gap-2 bg-neutral-800 hover:bg-neutral-700"
        >
          <Play />
          {isRunning ? "Executing..." : "Run & Visualize"}
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <Alert
          variant="destructive"
          className="mt-2 border border-red-500/60 bg-red-500/10"
        >
          <AlertTitle className="text-xs font-semibold">Error</AlertTitle>
          <AlertDescription className="text-xs font-mono">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
