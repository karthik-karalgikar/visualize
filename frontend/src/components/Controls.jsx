import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward } from "./icons";

export default function Controls({
  currentStep,
  setCurrentStep,
  executionLog,
  setExecutionLog,
  setCurrentStepData,
  autoPlay,
  setAutoPlay,
  currentStepData,
}) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* LEFT */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={currentStep === 0}
          onClick={() => {
            setExecutionLog([]);
            setCurrentStep(0);
            setCurrentStepData(null);
            setAutoPlay(false);
          }}
        >
          Reset
        </Button>

        <Button
          size="sm"
          variant={autoPlay ? "destructive" : "secondary"}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? "Pause" : "Auto Play"}
        </Button>
      </div>

      {/* CENTER */}
      <div className="flex items-center gap-4">
        <Button
          size="sm"
          variant="secondary"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
        >
          <SkipBack />
        </Button>

        <span className="font-semibold text-gray-100">
          {currentStep + 1} / {executionLog.length}
        </span>

        <Button
          size="sm"
          variant="secondary"
          disabled={currentStep === executionLog.length - 1}
          onClick={() =>
            setCurrentStep(Math.min(executionLog.length - 1, currentStep + 1))
          }
        >
          <SkipForward />
        </Button>
      </div>

      {/* RIGHT */}
      <div className="text-xs text-gray-500">
        {currentStepData?.event === "call" && `CALL ${currentStepData.func}()`}

        {currentStepData?.event === "return" &&
          `RETURN ${currentStepData.func}()`}

        {currentStepData?.event === "line" && `Line ${currentStepData.lineno}`}
      </div>
    </div>
  );
}
