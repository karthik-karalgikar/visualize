import { useEffect, useMemo, useState } from "react";
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
    <div className="h-screen w-screen bg-neutral-900">
      <div className="flex h-full w-full max-w-[1800px] mx-auto flex-col">
        {/* HEADER */}
        <div className="flex h-14 items-center justify-between border-b border-neutral-800 px-4">
          <div className="flex items-center gap-3">
            <img
              src="/dhristilogo.png"
              alt="Dhristi logo"
              className="h-[84px] w-[84px] object-contain"
            />

            <div className="flex h-[84px] items-center">
              <span className="text-base font-semibold text-gray-100">
                Visualise Code
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 gap-2 p-2 min-h-0">
          {/* CODE EDITOR */}
          <div className="flex-[7] rounded-lg border border-neutral-800 bg-neutral-800 overflow-hidden">
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
          </div>

          {/* VISUAL CANVAS */}
          <div className="flex-[5] rounded-lg border border-neutral-800 bg-neutral-800 overflow-hidden">
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
          </div>
        </div>

        {/* CONTROLS / TIMELINE */}
        <>
          <div className="h-px bg-neutral-700" />
          <div className="h-16 px-4">
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
          </div>
        </>
      </div>
    </div>
  );
}
