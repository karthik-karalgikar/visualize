import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Text, Divider, Image, Center } from "@mantine/core";
import CodeEditor from "./components/CodeEditor";
import Controls from "./components/Controls";
import VisualCanvas from "./components/VisualCanvas";

export default function App() {
  const [code, setCode] = useState(
    `import numpy as np\n\nlist1 = [1, 2, 3]\nx = np.array([[1.0, 2.0], [3.0, 4.0]])\npass`
  );

  const [executionLog, setExecutionLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [nnModels, setNnModels] = useState([]);
  const [callTree, setCallTree] = useState([]);
  const [recursiveFuncs, setRecursiveFuncs] = useState([]);

  const currentStepData = executionLog[currentStep] || null;

  const locals = useMemo(() => {
    return currentStepData?.after || currentStepData?.before || {};
  }, [currentStepData]);

  const changedVars = useMemo(() => {
    if (currentStep === 0 || !executionLog[currentStep - 1]) {
      return new Set();
    }

    const prev =
      executionLog[currentStep - 1]?.after ||
      executionLog[currentStep - 1]?.before ||
      {};

    const curr = locals;

    const changed = new Set();

    Object.keys(curr).forEach((key) => {
      if (JSON.stringify(prev[key]) !== JSON.stringify(curr[key])) {
        changed.add(key);
      }
    });

    return changed;
  }, [currentStep, executionLog, locals]);

  const codeLines = useMemo(() => code.split("\n"), [code]);

  useEffect(() => {
    if (!autoPlay) return;

    if (currentStep < executionLog.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setAutoPlay(false);
    }
  }, [autoPlay, currentStep, executionLog.length]);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setExecutionLog([]);
    setCurrentStep(0);
    setAutoPlay(false);

    try {
      const res = await fetch("https://dhristi-executor.onrender.com/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Execution failed");
      }

      if (data.success) {
        setExecutionLog(data.steps || []);
        setNnModels(data.nn_models || []);
        setCallTree(data.call_tree || []);
        setRecursiveFuncs(data.recursive_funcs || []);
      } else {
        throw new Error(data.error || "Execution failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box h="100vh" w="100vw" bg="dark.9">
      <Flex direction="column" h="100%" w="100%" maw={1800} mx="auto">
        {/* HEADER */}
        <Flex
          h={56}
          px="md"
          align="center"
          justify="space-between"
          style={{ borderBottom: "1px solid #262626" }}
        >
          <Flex align="center" gap="sm">
            <Image
              src="/dhristilogo.png"
              alt="Dhristi logo"
              w={84}
              h={84}
              fit="contain"
            />

            <Center h={84}>
              <Text size="md" fw={600} c="gray.0">
                Visualise Code
              </Text>
            </Center>
          </Flex>
        </Flex>

        {/* MAIN CONTENT */}
        <Flex flex={1} gap="sm" p="sm" style={{ minHeight: 0 }}>
          {/* CODE EDITOR */}
          <Box
            flex={7}
            bg="dark.8"
            style={{
              border: "1px solid #262626",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <CodeEditor
              code={code}
              setCode={setCode}
              runCode={runCode}
              isRunning={isRunning}
              error={error}
              executionLog={executionLog}
              currentStep={currentStep}
              currentStepData={currentStepData}
            />
          </Box>

          {/* VISUAL CANVAS */}
          <Box
            flex={5}
            bg="dark.8"
            style={{
              border: "1px solid #262626",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <VisualCanvas
              executionLog={executionLog}
              currentStep={currentStep}
              currentStepData={currentStepData}
              locals={locals}
              changedVars={changedVars}
              nnModels={nnModels}
              callTree={callTree}
              recursiveFuncs={recursiveFuncs}
            />
          </Box>
        </Flex>

        {/* CONTROLS / TIMELINE */}

        <>
          <Divider color="dark.7" />
          <Box h={64} px="md">
            <Controls
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              executionLog={executionLog}
              setExecutionLog={setExecutionLog}
              autoPlay={autoPlay}
              setAutoPlay={setAutoPlay}
              currentStepData={currentStepData}
              codeLines={codeLines}
            />
          </Box>
        </>
      </Flex>
    </Box>
  );
}
