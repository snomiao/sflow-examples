"use client";

import { useEffect, useState } from "react";
import ReactHighlightSyntax from "react-highlight-syntax";

/**
 *
 * @author: snomiao <snomiao@gmail.com>
 */
export default function Code({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  const [output, setOutput] = useState<string[]>([]);
  useEffect(() => {
    //
  }, [children]);
  const runable = !children.match("sleep-promise|sflow/|WIP") && language.match(/typescript|javascript/i);
  return (
    <div className="flex flex-col gap-4">
      <ReactHighlightSyntax
        language={
          language
            .replace("typescript", "TypeScript")
            .replace("javascript", "JavaScript") as any
        }
        copy={true}
      >
        {children}
      </ReactHighlightSyntax>
      <div>
        {!runable ? (
          <></> // skip
        ) : (
          <button
            onClick={() => {
              setOutput([]);
              const consoleLog = globalThis.console.log;
              globalThis.console.log = (...args) => {
                setOutput((output) => [
                  ...output,
                  args.map((e) => JSON.stringify(e, null, 2)).join(" "),
                ]);
              };
              const code = children
                // .replace(/console.log\((.*)\)/g, 'console.log("🚀", $1)')
                // wrap imports with jsdelivr
                .replace(
                  /import (.*) from "(.*)";/g,
                  'const $1 = await import("https://cdn.jsdelivr.net/npm/$2/+esm");'
                );

              eval(`
(async function() {    
    ${code}
})()
`).finally(() => {
                globalThis.console.log = consoleLog;
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Run (see console outputs)
          </button>
        )}
      </div>
      {!!output.length && (
        <div>
          Outputs
          <pre className="bg-gray-100 p-4 max-w-[90vw] break-all whitespace-pre-wrap">{output.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
