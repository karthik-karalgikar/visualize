import { Flex, Text, Button } from "@mantine/core";
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
    <Flex align="center" justify="space-between" w="100%">
      {/* LEFT */}
      <Flex gap="sm">
        <Button
          size="xs"
          variant="default"
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
          size="xs"
          color={autoPlay ? "red" : "gray"}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? "Pause" : "Auto Play"}
        </Button>
      </Flex>

      {/* CENTER */}
      <Flex align="center" gap="md">
        <Button
          variant="default"
          size="xs"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
        >
          <SkipBack />
        </Button>

        <Text fw={600} c="gray.0">
          {currentStep + 1} / {executionLog.length}
        </Text>

        <Button
          variant="default"
          size="xs"
          disabled={currentStep === executionLog.length - 1}
          onClick={() =>
            setCurrentStep(Math.min(executionLog.length - 1, currentStep + 1))
          }
        >
          <SkipForward />
        </Button>
      </Flex>

      {/* RIGHT */}
      <Text size="xs" c="gray.5">
        {currentStepData?.event === "call" && `CALL ${currentStepData.func}()`}

        {currentStepData?.event === "return" &&
          `RETURN ${currentStepData.func}()`}

        {currentStepData?.event === "line" && `Line ${currentStepData.lineno}`}
      </Text>
    </Flex>
  );
}
