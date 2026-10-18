import { useId, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import StudioGallery from "../components/StudioGallery";
import { studioImages } from "../data/studioImages";

const perspectives = [
  {
    title: "Question the obvious.",
    label: "Product thinking",
    text: "Start with the people using the product, not a list of screens. Map the friction, challenge assumptions, and make the next decision easier.",
    detail: "Context before a canvas.",
    image: 1,
  },
  {
    title: "Make every detail earn its place.",
    label: "Interface design",
    text: "Hierarchy, rhythm, movement, and the moments between states. A good interface feels natural because its details have been considered together.",
    detail: "Character without the noise.",
    image: 3,
  },
  {
    title: "Leave room for what comes next.",
    label: "Frontend craft",
    text: "Build an interface that can evolve. Reusable systems, accessible interactions, and thoughtful performance make the work useful beyond the first release.",
    detail: "Made to move forward.",
    image: 2,
  },
];

const Arrow = ({ diagonal = false }) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
    {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
  </svg>
);

const Studio = () => {
  const [activePerspective, setActivePerspective] = useState(0);
  const perspectiveId = useId();
  const selected = perspectives[activePerspective];
  const selectedImage = studioImages[selected.image] || studioImages[0];

  return (
    <main className="studio-page">
      <Seo
        title="The Studio - Perspective, Design & Engineering | M-Agency"
        description="Explore the M-Agency studio perspective: product thinking, intentional interface design, frontend craft, and an interactive visual journal."
        path="/studio"
        image={studioImages[0].src}
      />

      <section className="studio-hero" aria-labelledby="studio-title">
        <div className="container">
          <div className="studio-hero__topline">
            <span className="studio-eyebrow">The M-Agency studio</span>
            <span className="studio-hero__discipline">Design minded. Engineering led.</span>
          </div>
          <div className="studio-hero__heading">
            <h1 id="studio-title">A different<br /><em>point of view.</em></h1>
            <div className="studio-hero__intro">
              <p>Good digital products live where clear thinking, thoughtful design, and frontend craft meet.</p>
              <a href="#studio-perspective" className="studio-text-link">
                Get to know the approach <Arrow />
              </a>
            </div>
          </div>

          <figure className="studio-hero__frame">
            <div className="studio-hero__image" data-motion-image data-motion-direction="left">
              <img src={studioImages[0].src} alt={studioImages[0].alt} fetchpriority="high" decoding="async" />
            </div>
            <div className="studio-hero__image-label" aria-hidden="true">
              <span>Stay curious.</span>
              <span>Make it matter.</span>
            </div>
            <a className="studio-hero__explore" href="#studio-journal" aria-label="Explore the visual journal">
              <Arrow diagonal />
            </a>
            <figcaption>
              <span>Space for a new perspective.</span>
              <a href={studioImages[0].source} target="_blank" rel="noreferrer">{studioImages[0].credit || `Photography: ${studioImages[0].photographer}`}</a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="studio-perspective" id="studio-perspective" aria-labelledby="perspective-title">
        <div className="container">
          <div className="studio-perspective__heading" data-motion-item>
            <span className="studio-eyebrow">The perspective</span>
            <h2 id="perspective-title">Clarity is a<br /><em>creative advantage.</em></h2>
            <p>M-Agency brings product thinking and frontend engineering into one conversation. Less handoff. More attention to how the whole experience works.</p>
          </div>

          <div className="studio-perspective__body">
            <div className="studio-perspective__visual" data-motion-image data-motion-direction="right">
              <img key={selectedImage.src} src={selectedImage.src} alt={selectedImage.alt} loading="lazy" decoding="async" />
              <div className="studio-perspective__note" key={selected.detail}>
                <span>{selected.label}</span>
                <strong>{selected.detail}</strong>
              </div>
            </div>
            <div className="studio-principles" aria-label="Studio working principles">
              {perspectives.map((perspective, index) => {
                const isActive = index === activePerspective;
                return (
                  <div className={`studio-principle${isActive ? " is-active" : ""}`} key={perspective.title}>
                    <h3>
                      <button
                        id={`${perspectiveId}-trigger-${index}`}
                        type="button"
                        aria-expanded={isActive}
                        aria-controls={`${perspectiveId}-panel-${index}`}
                        onClick={() => setActivePerspective(index)}
                      >
                        <span><small>{perspective.label}</small>{perspective.title}</span>
                        <span className="studio-principle__toggle" aria-hidden="true"><i /><i /></span>
                      </button>
                    </h3>
                    <div
                      id={`${perspectiveId}-panel-${index}`}
                      role="region"
                      aria-labelledby={`${perspectiveId}-trigger-${index}`}
                      hidden={!isActive}
                    >
                      <p>{perspective.text}</p>
                    </div>
                  </div>
                );
              })}
              <Link className="studio-text-link" to="/work" viewTransition>See the thinking in practice <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-journal" id="studio-journal" aria-labelledby="studio-journal-title">
        <div className="container">
          <div className="studio-journal__heading" data-motion-item>
            <div>
              <span className="studio-eyebrow">The visual journal</span>
              <h2 id="studio-journal-title">Inspiration is<br /><em>everywhere.</em></h2>
            </div>
            <p>Light, texture, structure, collaboration. A collection of perspectives that makes room for fresh ideas.</p>
          </div>
          <StudioGallery images={studioImages} />
          <p className="studio-journal__disclosure">An editorial moodboard with credited stock photography, not a tour of a physical M-Agency office.</p>
        </div>
      </section>

      <section className="studio-next" aria-labelledby="studio-next-title">
        <div className="container">
          <span className="studio-eyebrow">From perspective to product</span>
          <div className="studio-next__heading" data-motion-item>
            <h2 id="studio-next-title">Let's make<br />something <em>meaningful.</em></h2>
            <Link className="studio-next__circle" to="/start-project" viewTransition aria-label="Start a project"><Arrow diagonal /></Link>
          </div>
          <div className="studio-next__links">
            <Link to="/work" viewTransition><span>Explore the work</span><Arrow /></Link>
            <Link to="/start-project" viewTransition><span>Start a conversation</span><Arrow /></Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Studio;
