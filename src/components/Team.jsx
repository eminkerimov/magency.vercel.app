import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import teammember1 from "../assets/img/author-frontend.jpg";
import teammember2 from "../assets/img/author-devops.jpg";
import teammember3 from "../assets/img/author-career.jpg";
import teammember4 from "../assets/img/author-backend.jpg";
import mayaPhoto from "../assets/img/testimonial-maya.jpg";
import { getAuthorProfile } from "../data/authors";
import ContentState from "./ContentState";

const portraitsByName = {
  "Adrian Thomas": teammember1,
  "Narate Ketram": teammember4,
  "Fernando Comet": teammember2,
  "Adedayo Saheed": teammember3,
  "Maya Chen": mayaPhoto,
};

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
        image: portraitsByName[name],
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
          <div className="top-authors__grid">
            {contributors.map((member) => {
              const countLabel = `${member.articleCount} ${member.articleCount === 1 ? "insight" : "insights"}`;

              return (
                <article className="author-tile" key={member.name}>
                  {member.image ? (
                    <img
                      className="author-tile__image"
                      src={member.image}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <div className="author-tile__fallback" aria-hidden="true">
                      <span>{member.initials}</span>
                    </div>
                  )}
                  <div className="author-tile__overlay" aria-hidden="true" />
                  <div className="author-tile__meta">
                    <span className="author-tile__badge">{member.focus}</span>
                    <span className="author-tile__count">{countLabel}</span>
                  </div>
                  <div className="author-tile__content">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                    <Link
                      to={`/blogs?q=${encodeURIComponent(member.name)}`}
                      aria-label={`View ${countLabel} by ${member.name}`}
                    >
                      View insights <span aria-hidden="true">{"\u2192"}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
