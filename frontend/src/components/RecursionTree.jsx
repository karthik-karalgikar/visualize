// export default function RecursionTree({
//   callTree,
//   currentStep,
//   executionLog,
// }) {
//   if (!callTree || callTree.length === 0) {
//     return null;
//   }

//   return (
//     <div className="bg-slate-800 border-2 border-purple-500 rounded-xl p-4 mb-6">
//       <div className="text-sm font-bold text-purple-400 mb-4">
//         Recursion Tree
//       </div>

//       <div className="space-y-2 font-mono text-sm">
//         {callTree.map((node, idx) => {
//           if (!node.func || node.func === "<module>") return null;
//           const isActive =
//             idx === currentStep &&
//             executionLog[currentStep]?.event === "call";

//           const isReturned =
//             idx < currentStep &&
//             executionLog[idx]?.event === "return";

//           return (
//             <div
//               key={idx}
//               className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
//                 isActive
//                   ? "bg-purple-600 text-white font-bold"
//                   : isReturned
//                   ? "bg-slate-700 text-slate-300"
//                   : "text-slate-400"
//               }`}
//               style={{
//                 marginLeft: `${node.depth * 16}px`,
//               }}
//             >
//               <span className="text-purple-400">↳</span>
//               <span>{node.func}</span>
//               <span className="text-xs text-slate-400">
//                   (
//                   {Array.isArray(node.args)
//                     ? node.args.join(", ")
//                     : node.args && typeof node.args === "object"
//                     ? Object.values(node.args).join(", ")
//                     : ""}
//                   )
//                 </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


// import React from "react";

// export default function RecursionTree({ callTree, currentStep, executionLog }) {
//   if (!callTree || callTree.length === 0) return null;

//   // -------- ACTIVE CALL (optional highlighting) --------
//   const activeCallIds = new Set();
//   if (executionLog && currentStep < executionLog.length) {
//     const step = executionLog[currentStep];
//     if (step?.call_id !== undefined) {
//       activeCallIds.add(step.call_id);
//     }
//   }

//   // -------- ROOT CALLS --------
//   const moduleCall = callTree.find(c => c.func === "<module>");

//   const visibleCallTree = callTree.filter(
//   c => (c.step_index ?? 0) <= currentStep
//   );

//   const rootCalls = moduleCall
//     ? visibleCallTree.filter(c => c.parent_id === moduleCall.call_id)
//     : visibleCallTree.filter(c => c.parent_id === null);

//   // -------- RECURSIVE RENDER --------
//   const renderCall = (call) => {
//     const children = visibleCallTree.filter(
//       c => c.parent_id === call.call_id
//     );
//     const isActive = activeCallIds.has(call.call_id);

//     return (
//       <div key={call.call_id} className="flex flex-col items-center">
//         {/* NODE */}
//         <div
//           className={`
//             px-4 py-3 rounded-lg border-2 font-mono text-sm
//             ${isActive
//               ? "bg-yellow-900/40 border-yellow-400 text-yellow-200"
//               : "bg-slate-900 border-purple-500 text-purple-300"}
//           `}
//         >
//           <div>
//             {call.func}(
//             {Object.entries(call.args || {})
//               .map(([k, v]) => `${k}=${v}`)
//               .join(", ")}
//             )
//           </div>

//           {call.return_step <= currentStep && call.return_value !== null && (
//             <div className="text-xs mt-1 opacity-70">
//               → returns {String(call.return_value)}
//             </div>
//           )}
//         </div>

//         {/* VERTICAL CONNECTOR */}
//         {children.length > 0 && (
//           <div className="h-6 w-px bg-purple-400" />
//         )}

//         {/* CHILDREN */}
//         {children.length > 0 && (
//           <>
//             {/* vertical down from parent */}
//             <div className="h-6 w-px bg-purple-400" />

//             {/* horizontal fork */}
//             <div className="relative w-full flex justify-center">
//               <div className="absolute top-0 left-0 right-0 h-px bg-purple-400" />
//             </div>

//             {/* children */}
//             <div className="flex gap-8 mt-4">
//               {children.map(child => (
//                 <div key={child.call_id} className="flex flex-col items-center">
//                   {/* vertical up into child */}
//                   <div className="h-4 w-px bg-purple-400" />
//                   {renderCall(child)}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   // -------- RENDER --------
//   return (
//     <div className="bg-slate-800 border-2 border-purple-500 rounded-xl p-6 mb-6">
//       <div className="text-purple-400 font-semibold mb-4">
//         Recursion Tree
//       </div>

//       <div className="overflow-x-auto flex justify-center">
//         {rootCalls.map(renderCall)}
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function RecursionTree({ callTree, currentStep, executionLog }) {
  console.log("=== RecursionTree Render ===");
  console.log("callTree received:", callTree);
  console.log("currentStep:", currentStep);
  console.log("executionLog length:", executionLog?.length);
  
  if (!callTree || callTree.length === 0) {
    console.log("No call tree data");
    return null;
  }

  // CRITICAL: Only show calls that have been ENCOUNTERED by currentStep
  const visibleCallTree = callTree.filter(
    c => (c.step_index ?? 0) <= currentStep
  );

  console.log("visibleCallTree:", visibleCallTree.map(c => ({
    func: c.func,
    call_id: c.call_id,
    step_index: c.step_index,
    return_step: c.return_step,
    parent_id: c.parent_id
  })));

  // Get currently active call
  const activeCallIds = new Set();
  if (executionLog && currentStep < executionLog.length) {
    const step = executionLog[currentStep];
    if (step?.call_id !== undefined) {
      activeCallIds.add(step.call_id);
    }
  }

  // Find root calls (skip <module> as it's always there)
  // const moduleCall = visibleCallTree.find(c => c.func === "<module>");
  // const rootCalls = moduleCall
  //   ? visibleCallTree.filter(c => c.parent_id === moduleCall.call_id)
  //   : visibleCallTree.filter(c => c.parent_id === null);
  const rootCalls = visibleCallTree.filter(c => c.parent_id === 0);

  // console.log("moduleCall:", moduleCall);
  console.log("rootCalls:", rootCalls);

  // Recursive render function
  const renderCall = (call) => {
    // Only show children that are in visibleCallTree
    const children = visibleCallTree.filter(
      c => c.parent_id === call.call_id
    );
    
    const isActive = activeCallIds.has(call.call_id);
    
    // Check if this call has returned (and the return event has been reached)
    const hasReturned = call.return_step !== undefined && call.return_step <= currentStep;

    return (
      <div key={call.call_id} className="flex flex-col items-center">
        {/* CALL NODE */}
        <div
          className={`
            px-4 py-3 rounded-lg border-2 font-mono text-sm min-w-[180px]
            transition-all duration-300
            ${isActive
              ? "bg-yellow-500 border-yellow-600 text-gray-900 font-bold shadow-lg scale-105"
              : hasReturned
              ? "bg-green-900/60 border-green-500 text-green-200"
              : "bg-slate-900 border-purple-500 text-purple-300"}
          `}
        >
          <div className="font-semibold">
            {call.func}(
            {Object.entries(call.args || {})
              .map(([k, v]) => {
                const displayValue = typeof v === 'object' ? JSON.stringify(v) : v;
                return `${k}=${displayValue}`;
              })
              .join(", ")}
            )
          </div>

          {/* Show return value ONLY after it has returned */}
          {hasReturned && call.return_value !== undefined && call.return_value !== null && (
            <div className="text-xs mt-2 pt-2 border-t border-green-500/30 font-semibold">
              → returns {String(call.return_value)}
            </div>
          )}
          
          {/* Show computing indicator for active calls */}
          {isActive && !hasReturned && (
            <div className="text-xs mt-2 pt-2 border-t border-yellow-500/30 italic animate-pulse">
              computing...
            </div>
          )}
        </div>

        {/* CONNECTORS AND CHILDREN */}
        {children.length > 0 && (
          <>
            {/* Vertical line down */}
            <div className="h-8 w-0.5 bg-purple-400" />

            {children.length === 1 ? (
              // Single child - direct vertical connection
              renderCall(children[0])
            ) : (
              // Multiple children - branching
              <>
                {/* Horizontal branching line */}
                <div className="relative" style={{ width: `${children.length * 200}px`, height: '1px' }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-purple-400" />
                </div>

                {/* Child nodes */}
                <div className="flex gap-12 mt-0">
                  {children.map((child) => (
                    <div key={child.call_id} className="flex flex-col items-center">
                      {/* Vertical line up to child */}
                      <div className="h-8 w-0.5 bg-purple-400" />
                      {renderCall(child)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  // Don't show anything if no recursive calls yet
  if (rootCalls.length === 0) {
    console.log("No root calls yet - returning null");
    return null;
  }

  return (
    <div className="bg-slate-800 border-2 border-purple-500 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-purple-400 font-semibold text-lg">
          Recursion Tree
        </div>
        <div className="text-sm text-gray-400">
          Showing calls up to step {currentStep + 1} / {executionLog.length}
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex justify-center min-w-max px-4">
          <div className="flex gap-8">
            {rootCalls.map(call => renderCall(call))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
          <span className="text-gray-400">Currently executing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-900/60 border-2 border-green-500 rounded"></div>
          <span className="text-gray-400">Returned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-900 border-2 border-purple-500 rounded"></div>
          <span className="text-gray-400">Called (computing)</span>
        </div>
      </div>
    </div>
  );
}