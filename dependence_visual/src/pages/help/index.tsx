import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownNavbar from "markdown-navbar";
import "markdown-navbar/dist/navbar.css";
import { useParams } from "umi";

const docs = {
  index: require("./docs/index.md").default,
  "module-coupling": require("./docs/module-coupling.md").default,
};

export default function Help() {
  const { name = "index" } = useParams();
  const doc = docs[name];

  return (
    <div>
      <MarkdownNavbar source={doc} />
      <ReactMarkdown source={doc} />
    </div>
  );
}
