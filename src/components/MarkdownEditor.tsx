"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";

// import "./MarkdownEditor.css";

const MarkdownEditor = ({ markdown }: { markdown: string }) => {
  return (
    <div className="w-1/2 p-2 overflow-hidden break-all">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              // 코드 (```)
              <SyntaxHighlighter style={nord} language={match[1]} PreTag="div">
                {String(children)
                  .replace(/\n$/, "")
                  .replace(/\n&nbsp;\n/g, "")
                  .replace(/\n&nbsp\n/g, "")}
              </SyntaxHighlighter>
            ) : (
              <SyntaxHighlighter
                style={nord}
                background="green"
                language="textile"
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
          // 인용문 (>)
          blockquote({ children, ...props }) {
            return (
              <blockquote
                style={{
                  background: "#7afca19b",
                  padding: "1px 15px",
                  borderRadius: "10px",
                }}
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          img({ ...props }) {
            console.log("props", props);
            return (
              <Image
                src={props.src?.replace("/public/", "/") || ""}
                alt="MarkdownRenderer__Image"
                width={500}
                height={350}
              />
            );
          },
          em({ children, ...props }) {
            return (
              <span style={{ fontStyle: "italic" }} {...props}>
                {children}
              </span>
            );
          },
        }}
      >
        {markdown
          .replace(/\n/gi, "\n\n")
          .replace(/\*\*/gi, "@$_%!^")
          .replace(/@\$_%!\^/gi, "**")
          .replace(/<\/?u>/gi, "*")}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownEditor;
