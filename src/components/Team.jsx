import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getAuthorPortrait, getAuthorProfile } from "../data/authors";
import ContentState from "./ContentState";

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const buildContributors = (articles) => {
  const contributors = new Map();

  articles.forEach((article) => {
    const name = article.author?.trim();

    if (!name) return;

    if (!contributors.has(name)) {
      const profile = getAuthorProfile(name);

      contributors.set(name, {
        ...profile,
        name,
        image: getAuthorPortrait(name, "editorial"),
        initials: getInitials(name),
        articleCount: 0,
      });
    }

    contributors.get(name).articleCount += 1;
  });

  return Array.from(contributors.values());
};

const Team = ({
  articles = [],
  error,
  isError = false,
  isPending = false,
  onRetry,
}) => {
  const contributors = useMemo(
    () => buildContributors(articles),
    [articles]
  );
  const intro = contributors.length
    ? `${contributors.length} engineering perspectives behind ${articles.length} published insights.`
    : "Engineering perspectives from the people behind the Insights library.";

  return (
    <section className="top-authors" id="team" aria-labelledby="team-title">
      <div className="container">
        <div className="top-authors__heading">
          <span>Editorial voices</span>
          <h2 id="team-title">Meet the contributors</h2>
          <p>{intro}</p>
        </div>

        {isPending ? (
          <ContentState count={5} label="Loading contributors" />
        ) : isError ? (
          <ContentState
            status="error"
            title="Contributors are temporarily unavailable"
            message={error?.message || "The contributor directory could not be loaded."}
            onRetry={onRetry}
          />
        ) : contributors.length === 0 ? (
          <ContentState
            status="empty"
            eyebrow="Editorial team"
            title="No contributors yet"
            message="Contributor profiles will appear when the first insight is published."
          />
        ) : (
          <div className="top-authors__grid" role="list">
            {contributors.map((member, index) => {
              const countLabel = `${member.articleCount} ${member.articleCount === 1 ? "insight" : "insights"}`;

              return (
                <Link
                  className={`contributor-card contributor-card--${index + 1}`}
                  key={member.name}
                  role="listitem"
                  to={`/blogs?q=${encodeURIComponent(member.name)}`}
                  aria-label={`Browse ${countLabel} by ${member.name}`}
                >
                  <span className="contributor-card__portrait">
                    {member.image ? (
                      <img src={member.image} alt="" loading="lazy" />
                    ) : (
                      <span aria-hidden="true">{member.initials}</span>
                    )}
                  </span>

                  <span className="contributor-card__scrim" aria-hidden="true" />

                  <span className="contributor-card__meta">
                    <span className="contributor-card__focus">{member.focus}</span>
                    <span>{countLabel}</span>
                  </span>

                  <span className="contributor-card__body">
                    <strong>{member.name}</strong>
                    <span className="contributor-card__role">{member.role}</span>
                    {index === 0 ? (
                      <span className="contributor-card__bio">{member.bio}</span>
                    ) : null}
                  </span>

                  <span className="contributor-card__footer">
                    <span>Explore writing</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 12H19M14 7L19 12L14 17" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
