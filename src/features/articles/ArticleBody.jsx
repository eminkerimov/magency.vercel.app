import React, { forwardRef } from "react";

const renderBlock = (block, index) => {
  if (!block || typeof block !== "object") return null;

  const key = `${block.type || "block"}-${index}`;

  switch (block.type) {
    case "lead":
      return (
        <p className="article-body__lead" key={key}>
          {block.text}
        </p>
      );
    case "paragraph":
      return <p key={key}>{block.text}</p>;
    case "quote":
      return <blockquote key={key}>{block.text}</blockquote>;
    case "list":
      return (
        <ul key={key}>
          {(block.items || []).map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre
          aria-label={`${block.language || "Code"} example`}
          key={key}
        >
          <code data-language={block.language || undefined}>
            {block.code}
          </code>
        </pre>
      );
    default:
      return null;
  }
};

const ArticleBody = forwardRef(({ sections = [] }, ref) => (
  <article className="article-body" ref={ref}>
    {sections.map((section) => {
      const headingId = `${section.id}-heading`;
      const showTitle = section.showTitle !== false && section.title;

      return (
        <section
          id={section.id}
          aria-label={!showTitle ? section.label : undefined}
          aria-labelledby={showTitle ? headingId : undefined}
          key={section.id}
        >
          {showTitle && <h2 id={headingId}>{section.title}</h2>}
          {(section.blocks || []).map(renderBlock)}
        </section>
      );
    })}
  </article>
));

ArticleBody.displayName = "ArticleBody";

export default ArticleBody;
