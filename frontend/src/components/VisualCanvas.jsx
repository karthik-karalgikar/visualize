import {
  Box,
  Text,
  ScrollArea,
  Paper,
  Stack,
  Group,
  Badge,
} from "@mantine/core";

import ArrayVisualization from "./ArrayVisualization";
import MatrixVisualization from "./MatrixVisualization";
import DictVisualization from "./DictVisualization";
import NeuralNetworkVisualization from "./NeuralNetworkVisualization";
import RecursionTree from "./RecursionTree";

import { detectType } from "../utils/detectType";
import { renderFormula } from "../utils/renderFormula";

export default function VisualCanvas({
  executionLog,
  currentStepData,
  locals,
  changedVars,
  nnModels,
  callTree,
  recursiveFuncs,
  currentStep,
}) {
  const renderValue = (value, name) => {
    const type = detectType(value);

    switch (type) {
      case "array":
        return <ArrayVisualization arr={value} name={name} />;

      case "ndarray":
        return <MatrixVisualization matrix={value} name={name} />;

      case "tensor_scalar": {
        const scalarValue = Array.isArray(value.values)
          ? value.values[0]
          : value.values;

        return (
          <Group gap="xs">
            <Text ff="monospace" c="orange.4" fw={700} fz="xl">
              {scalarValue}
            </Text>
            <Text size="xs" c="gray.6">
              torch.{value.dtype}
            </Text>
          </Group>
        );
      }

      case "tensor_1d":
        return (
          <Stack gap="xs">
            <Text size="xs" c="gray.5">
              torch tensor: shape {value.shape.join("x")} | {value.dtype}
            </Text>
            <ArrayVisualization arr={value.values} name={name} />
          </Stack>
        );

      case "tensor_2d":
        return (
          <Stack gap="xs">
            <Text size="xs" c="gray.5">
              torch tensor: shape {value.shape.join("x")} | {value.dtype}
            </Text>
            <MatrixVisualization
              matrix={{ type: "ndarray", values: value.values }}
              name={name}
            />
          </Stack>
        );

      case "tensor_nd":
        return (
          <Stack gap="xs">
            <Text size="xs" c="yellow.4">
              torch tensor: shape {value.shape.join("x")} | {value.dtype}
            </Text>
            <Paper p="sm" bg="dark.6">
              {value.summary ? (
                <>
                  <Text size="sm" c="gray.3">
                    Size: {value.summary.size}
                  </Text>
                  <Text size="sm" c="gray.3">
                    Min: {value.summary.min?.toFixed(4)}
                  </Text>
                  <Text size="sm" c="gray.3">
                    Max: {value.summary.max?.toFixed(4)}
                  </Text>
                  <Text size="sm" c="gray.3">
                    Mean: {value.summary.mean?.toFixed(4)}
                  </Text>
                </>
              ) : (
                <Text size="sm" c="gray.4">
                  High-dimensional tensor
                </Text>
              )}
            </Paper>
          </Stack>
        );

      case "matrix":
        return <MatrixVisualization matrix={value} name={name} />;

      case "dict":
        return <DictVisualization dict={value} />;

      case "string":
        return (
          <Text ff="monospace" c="green.4" fz="lg">
            "{value}"
          </Text>
        );

      case "number":
        return (
          <Text ff="monospace" c="orange.4" fw={700} fz="xl">
            {value}
          </Text>
        );

      default:
        return (
          <Text ff="monospace" c="gray.5">
            {JSON.stringify(value)}
          </Text>
        );
    }
  };

  return (
    <Paper p="md" radius="md" bg="dark.8" withBorder h="100%">
      <Text fw={600} c="gray.0" mb="sm">
        Visual Canvas
      </Text>

      {executionLog.length === 0 ? (
        <Stack align="center" justify="center" h={400}>
          <Text fz={48} opacity={0.5}>
            🎨
          </Text>
          <Text c="gray.5" fz="lg">
            Run your code to see visualizations
          </Text>
        </Stack>
      ) : (
        <ScrollArea h={500}>
          <Stack gap="md" p="sm">
            {/* Neural Networks */}
            {nnModels && nnModels.length > 0 && (
              <Stack gap="md">
                <Text fw={700} size="sm" c="cyan.4">
                  Detected Neural Networks
                </Text>

                {nnModels.map((model, idx) => (
                  <Paper
                    key={idx}
                    p="md"
                    radius="xl"
                    withBorder
                    style={{ borderColor: "#22d3ee" }}
                  >
                    <NeuralNetworkVisualization model={model} />
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Recursion Tree */}
            {callTree &&
              callTree.length > 1 &&
              recursiveFuncs &&
              recursiveFuncs.length > 0 && (
                <RecursionTree
                  callTree={callTree}
                  currentStep={currentStep}
                  executionLog={executionLog}
                />
              )}

            {/* Console Output */}
            {currentStepData?.stdout?.length > 0 && (
              <Paper
                p="md"
                radius="xl"
                bg="dark.9"
                withBorder
                style={{ borderColor: "#22c55e" }}
              >
                <Text size="xs" fw={700} c="green.4" mb="xs">
                  Console Output
                </Text>
                <Text
                  ff="monospace"
                  size="sm"
                  c="green.3"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {currentStepData.stdout.join("\n")}
                </Text>
              </Paper>
            )}

            {/* Formula */}
            {currentStepData?.formula && (
              <Paper
                p="md"
                radius="xl"
                withBorder
                style={{ borderColor: "#6366f1" }}
              >
                <Text size="xs" fw={700} c="indigo.4" mb="xs">
                  📐 Formula at Line {currentStepData.lineno}
                </Text>
                <Paper p="md" bg="dark.9" radius="md">
                  {renderFormula(currentStepData.formula)}
                </Paper>
              </Paper>
            )}

            {/* Local Variables */}
            {Object.keys(locals).length > 0 ? (
              Object.entries(locals).map(([name, value]) => (
                <Paper
                  key={name}
                  p="md"
                  radius="xl"
                  withBorder
                  style={{
                    borderColor: changedVars.has(name) ? "#eab308" : "#475569",
                    backgroundColor: changedVars.has(name)
                      ? "rgba(234,179,8,0.15)"
                      : "rgba(30,41,59,0.8)",
                  }}
                >
                  <Group gap="sm" mb="md">
                    <Text ff="monospace" fw={700} fz="lg" c="blue.4">
                      {name}
                    </Text>

                    <Badge color="dark" variant="filled">
                      {detectType(value)}
                    </Badge>

                    {changedVars.has(name) && (
                      <Badge color="yellow" variant="filled">
                        CHANGED
                      </Badge>
                    )}
                  </Group>

                  {renderValue(value, name)}
                </Paper>
              ))
            ) : (
              <Text c="gray.5" ta="center" py="xl">
                No variables defined yet
              </Text>
            )}
          </Stack>
        </ScrollArea>
      )}
    </Paper>
  );
}
