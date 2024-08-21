import { readFile } from "fs/promises";
import Markdown from "react-markdown";
import Code from "./Code";

export default async function Home() {
  return (
    <div className="relative bg-gradient-radial min-h-screen flex flex-col items-center justify-center">
      <div className="p-4 border-[6px] bg-white ">
        <Markdown
          components={{
            h1: ({ node, children }) => (
              <h1 className="text-6xl font-bold mt-8">{children}</h1>
            ),
            h2: ({ node, children }) => (
              <h2 className="text-3xl font-bold mt-8">{children}</h2>
            ),
            h3: ({ node, children }) => (
              <h3 className="text-2xl font-bold mt-8">{children}</h3>
            ),
            a: ({ node, children, href }) => (
              <a
                className="text-blue-500 underline"
                href={href as string}
                target="_blank"
              >
                {children}
              </a>
            ),
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <Code language={match[1]}>
                  {String(children).replace(/\n$/, "")}
                </Code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {await readFile("./README.md", "utf8")}
        </Markdown>
      </div>
    </div>
  );
}
