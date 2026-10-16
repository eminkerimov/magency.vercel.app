import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { submitContact } from "../api/forms";
import Seo from "../components/Seo";
import { caseStudies } from "../data/caseStudies";
import { engagements, getEngagement } from "../data/engagements";
import { getService } from "../data/services";

const TOTAL_STEPS = 3;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const stages = [
  ["idea", "Idea or early concept", "Shape direction and a practical first release."],
  ["in-progress", "Already in progress", "Add senior delivery to active product work."],
  ["live-product", "Live product", "Improve with users, data, and real constraints."],
];
const timelines = [
  ["soon", "As soon as possible", "A priority is already waiting."],
  ["one-two-months", "Within 1-2 months", "There is time to plan the right start."],
  ["flexible", "Flexible", "Fit and scope matter more than a fixed date."],
];
const steps = [
  ["Direction", "What are we solving?", "Choose the closest starting point. It gives the conversation shape without locking the scope."],
  ["Context", "Give the project some texture.", "Focus on the user problem, the current constraint, and the outcome that would matter."],
  ["Contact", "Save a local project snapshot.", "Add your details, review the context, and create a browser-only demo receipt."],
];
const cleanParam = (value) => String(value || "").trim().slice(0, 80);
const makeForm = (engagement) => ({
  engagement, stage: "", timeline: "", summary: "", name: "",
  email: "", company: "", website: "",
});
const PROJECT_DRAFT_KEY = "magency:v1:project-brief-draft";
const PROJECT_DRAFT_FIELDS = [
  "engagement", "stage", "timeline", "summary", "name", "email", "company",
];

const readProjectDraft = (engagement) => {
  const fallback = makeForm(engagement);

  if (typeof window === "undefined") return { step: 1, form: fallback };

  try {
    const stored = JSON.parse(window.sessionStorage.getItem(PROJECT_DRAFT_KEY));
    if (!stored?.form || typeof stored.form !== "object") {
      return { step: 1, form: fallback };
    }

    const restored = PROJECT_DRAFT_FIELDS.reduce((draft, field) => {
      if (typeof stored.form[field] === "string") draft[field] = stored.form[field];
      return draft;
    }, {});
    const storedStep = Number(stored.step);

    return {
      step: Number.isInteger(storedStep) ? Math.min(Math.max(storedStep, 1), TOTAL_STEPS) : 1,
      form: {
        ...fallback,
        ...restored,
        engagement: engagement || restored.engagement || "",
        website: "",
      },
    };
  } catch {
    return { step: 1, form: fallback };
  }
};

const ChoiceGroup = ({ legend, hint, name, options, value, onChange, onClear, error, firstRef, required = false }) => {
  const describedBy = [hint ? name + "-hint" : "", error ? name + "-error" : ""]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
  <fieldset aria-describedby={describedBy}>
    <legend>{legend}</legend>
    {(hint || (value && onClear)) && (
      <div className="project-form__group-meta">
        {hint && <p className="project-form__hint" id={name + "-hint"}>{hint}</p>}
        {value && onClear && (
          <button className="project-form__clear" type="button" onClick={onClear}>
            Clear selection
          </button>
        )}
      </div>
    )}
    <div className="project-choice-grid">
      {options.map(([id, title, detail], index) => (
        <label className={"project-choice" + (value === id ? " is-selected" : "")} key={id}>
          <input
            ref={index === 0 ? firstRef : undefined}
            type="radio"
            name={name}
            value={id}
            checked={value === id}
            onChange={() => onChange(id)}
            required={required}
            aria-invalid={Boolean(error)}
          />
          <span className="project-choice__control" aria-hidden="true"></span>
          <span className="project-choice__copy"><strong>{title}</strong><small>{detail}</small></span>
        </label>
      ))}
    </div>
    {error && <small className="project-form__error" id={name + "-error"}>{error}</small>}
  </fieldset>
  );
};

const StartProject = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryEngagement = getEngagement(cleanParam(searchParams.get("interest")));
  const serviceId = cleanParam(searchParams.get("service"));
  const reference = cleanParam(searchParams.get("reference"));
  const selectedService = getService(serviceId);
  const referenceStudy = caseStudies.find((study) => study.slug === reference);
  const recommendedEngagementId =
    queryEngagement?.id ||
    selectedService?.engagement ||
    referenceStudy?.engagement ||
    "";
  const [initialDraft] = useState(() => readProjectDraft(recommendedEngagementId));
  const [step, setStep] = useState(initialDraft.step);
  const [form, setForm] = useState(initialDraft.form);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "", receipt: null });
  const refs = useRef({});
  const contextHeadingRef = useRef(null);
  const stepTitleRef = useRef(null);
  const successTitleRef = useRef(null);
  const firstRender = useRef(true);
  const controllerRef = useRef(null);
  const isSubmitting = status.type === "submitting";
  const currentEngagement = getEngagement(form.engagement);
  const currentStep = steps[step - 1];

  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => {
    const { website: _website, ...draftForm } = form;
    const hasDraft = step > 1 || Object.values(draftForm).some((value) => value.trim());

    try {
      if (status.type === "success" || !hasDraft) {
        window.sessionStorage.removeItem(PROJECT_DRAFT_KEY);
      } else {
        window.sessionStorage.setItem(
          PROJECT_DRAFT_KEY,
          JSON.stringify({ step, form: draftForm })
        );
      }
    } catch {
      // The guided brief remains usable when browser storage is unavailable.
    }
  }, [form, status.type, step]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const frame = window.requestAnimationFrame(() => stepTitleRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status.type === "error") setStatus({ type: "idle", message: "", receipt: null });
  };
  const removeContext = (paramName) => {
    const nextParams = new URLSearchParams(searchParams);
    const hasRemainingContext =
      paramName === "service" ? Boolean(referenceStudy) : Boolean(selectedService);
    nextParams.delete(paramName);
    setSearchParams(nextParams, { replace: true });
    window.requestAnimationFrame(() => {
      (hasRemainingContext ? contextHeadingRef.current : stepTitleRef.current)
        ?.focus({ preventScroll: true });
    });
  };
  const validate = (targetStep) => {
    const next = {};
    if (targetStep === 1 && !form.stage) next.stage = "Choose the stage closest to your project.";
    if (targetStep === 2) {
      if (!form.timeline) next.timeline = "Choose a likely starting window.";
      if (form.summary.trim().length < 30) next.summary = "Add at least 30 characters so there is enough context.";
    }
    if (targetStep === 3) {
      if (form.name.trim().length < 2) next.name = "Enter at least 2 characters.";
      if (!emailPattern.test(form.email.trim())) next.email = "Enter a valid email address.";
    }
    return next;
  };
  const showErrors = (next) => {
    setErrors(next);
    setStatus({ type: "error", message: "Please check the highlighted information.", receipt: null });
    const first = ["stage", "timeline", "summary", "name", "email"].find((field) => next[field]);
    window.requestAnimationFrame(() => refs.current[first]?.focus());
  };
  const goNext = () => {
    const next = validate(step);
    if (Object.keys(next).length) {
      showErrors(next);
      return;
    }
    setErrors({});
    setStatus({ type: "idle", message: "", receipt: null });
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  };
  const goBack = () => {
    setErrors({});
    setStatus({ type: "idle", message: "", receipt: null });
    setStep((current) => Math.max(1, current - 1));
  };
  const buildMessage = () => {
    const stage = stages.find(([id]) => id === form.stage);
    const timeline = timelines.find(([id]) => id === form.timeline);
    return [
      "Project brief",
      form.company.trim() && "Company: " + form.company.trim(),
      selectedService && "Service interest: " + selectedService.name,
      referenceStudy && "Reference case: " + referenceStudy.name,
      stage && "Product stage: " + stage[1],
      timeline && "Preferred start: " + timeline[1],
      "",
      form.summary.trim(),
    ].filter((line) => line !== false && line !== null && line !== undefined).join("\n");
  };
  const submit = async (event) => {
    event.preventDefault();
    if (step < TOTAL_STEPS) {
      goNext();
      return;
    }
    const next = validate(3);
    if (Object.keys(next).length) {
      showErrors(next);
      return;
    }
    controllerRef.current = new AbortController();
    setStatus({ type: "submitting", message: "", receipt: null });
    try {
      const receipt = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: buildMessage(),
        engagement: currentEngagement?.id || "",
        website: form.website,
      }, controllerRef.current.signal);
      setStatus({ type: "success", message: "Demo receipt saved in this browser.", receipt });
      window.requestAnimationFrame(() => successTitleRef.current?.focus());
    } catch (error) {
      if (error?.name === "AbortError") return;
      const serverErrors = { ...(error?.fields || {}) };
      setErrors(serverErrors);
      setStatus({
        type: "error",
        message: error?.message || "The demo receipt could not be saved. Please try again.",
        receipt: null,
      });
      const first = ["name", "email"].find((field) => serverErrors[field]);
      window.requestAnimationFrame(() => refs.current[first]?.focus());
    }
  };
  const restart = () => {
    setForm(makeForm(recommendedEngagementId));
    setErrors({});
    setStatus({ type: "idle", message: "", receipt: null });
    setStep(1);
  };

  const engagementOptions = engagements.map((item) => [
    item.id,
    item.title,
    item.formHint || item.bestFor,
  ]);
  const receiptDate = status.receipt?.receivedAt
    ? new Intl.DateTimeFormat("en", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
      }).format(new Date(status.receipt.receivedAt))
    : "";

  return (
    <main className="start-project">
      <Seo
        title="Start a Project | M-Agency"
        description="Share a focused project brief for senior frontend product work, audits, and ongoing support."
        path="/start-project"
      />
      <div className="start-project__glow start-project__glow--one" aria-hidden="true"></div>
      <div className="start-project__glow start-project__glow--two" aria-hidden="true"></div>
      <section className="start-project__brief" aria-label="Project brief">
        <div className="container">
          <div className="start-project__shell">
            <div className="start-project__form-panel">
              <header className="start-project__intro">
                <div className="start-project__intro-grid">
                  <div>
                    <span className="start-project__eyebrow">Project brief</span>
                    <h1>Start with the product problem.</h1>
                  </div>
                  <p>Three focused steps turn it into a useful brief, not a generic contact form. Everything stays in this browser.</p>
                </div>
              </header>
              {status.type === "success" ? (
                <div className="project-receipt" role="status">
                  <div className="project-receipt__mark" aria-hidden="true">&#10003;</div>
                  <span className="project-receipt__eyebrow">Browser demo saved</span>
                  <h2 ref={successTitleRef} tabIndex="-1">Brief ready, {form.name.trim().split(" ")[0]}.</h2>
                  <p>A privacy-safe receipt was stored locally. Your contact details and project message were not sent anywhere.</p>
                  <dl className="project-receipt__details">
                    <div><dt>Receipt</dt><dd>{status.receipt?.requestId || "Saved"}</dd></div>
                    {receiptDate && <div><dt>Saved</dt><dd>{receiptDate}</dd></div>}
                    <div><dt>Starting point</dt><dd>{currentEngagement?.title || "Open discovery"}</dd></div>
                    {selectedService && <div><dt>Service</dt><dd>{selectedService.name}</dd></div>}
                    {referenceStudy && <div><dt>Reference</dt><dd>{referenceStudy.name}</dd></div>}
                  </dl>
                  <div className="project-receipt__actions">
                    <Link to="/work">Explore case studies <span aria-hidden="true">&rarr;</span></Link>
                    <button type="button" onClick={restart}>Create another brief</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="project-progress">
                    <div
                      className="project-progress__track"
                      role="progressbar"
                      aria-label="Project brief progress"
                      aria-valuemin="1"
                      aria-valuemax={TOTAL_STEPS}
                      aria-valuenow={step}
                      aria-valuetext={`${currentStep[0]}, step ${step} of ${TOTAL_STEPS}`}
                      style={{ "--brief-progress": step / TOTAL_STEPS }}
                    ><span></span></div>
                    <ol>
                      {steps.map((item, index) => {
                        const number = index + 1;
                        const className = number === step ? "is-current" : number < step ? "is-complete" : "";
                        return (
                          <li className={className} aria-current={number === step ? "step" : undefined} key={item[0]}>
                            <span>{number < step ? "\u2713" : "0" + number}</span>
                            <small>{item[0]}</small>
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  {(selectedService || referenceStudy) && (
                    <aside className="project-context" aria-labelledby="project-context-title">
                      <div className="project-context__heading">
                        <span>Brief context</span>
                        <h2 id="project-context-title" ref={contextHeadingRef} tabIndex="-1">
                          Starting point carried in
                        </h2>
                      </div>
                      <div className="project-context__items">
                        {selectedService && (
                          <div className="project-context__item project-context__item--service">
                            <span className="project-context__icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 3.5 14 8l4.5 2-4.5 2-2 4.5-2-4.5-4.5-2L10 8l2-4.5Z" />
                                <path d="m17.5 15 .8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7Z" />
                              </svg>
                            </span>
                            <div className="project-context__copy">
                              <small>Selected service</small>
                              <strong>{selectedService.name}</strong>
                              <span>Suggested format: {getEngagement(selectedService.engagement)?.title}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeContext("service")}
                              aria-label={"Remove " + selectedService.name + " context"}
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                        )}
                        {referenceStudy && (
                          <div className="project-context__item project-context__item--reference">
                            <span className="project-context__icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none">
                                <path d="M5 4.5h10.5L19 8v11.5H5v-15Z" />
                                <path d="M15 4.5V8h4M8.5 12h7M8.5 15.5h5" />
                              </svg>
                            </span>
                            <div className="project-context__copy">
                              <small>Reference case</small>
                              <strong>{referenceStudy.name}</strong>
                              <Link to={"/work/" + referenceStudy.slug}>
                                Review case study <span aria-hidden="true">&rarr;</span>
                              </Link>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeContext("reference")}
                              aria-label={"Remove " + referenceStudy.name + " reference"}
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </aside>
                  )}

                  <form className="project-form" id="project-brief" onSubmit={submit} noValidate aria-busy={isSubmitting} aria-labelledby="brief-title">
                    <header className="project-form__heading">
                      <span>{currentStep[0]}</span>
                      <h2 id="brief-title" ref={stepTitleRef} tabIndex="-1">{currentStep[1]}</h2>
                      <p>{currentStep[2]}</p>
                    </header>
                    <label className="project-form__honeypot" aria-hidden="true">
                      <span>Leave this field blank</span>
                      <input
                        type="text"
                        name="website"
                        value={form.website}
                        onChange={(event) => updateField("website", event.target.value)}
                        tabIndex="-1"
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                    </label>

                    {step === 1 && (
                      <div className="project-form__step project-form__step--direction">
                        <ChoiceGroup
                          legend="What kind of support is closest?"
                          hint="Optional. Choose a starting point or leave it open."
                          name="engagement"
                          options={engagementOptions}
                          value={form.engagement}
                          onChange={(value) => updateField("engagement", value)}
                          onClear={() => updateField("engagement", "")}
                        />
                        <ChoiceGroup
                          legend="Where is the product now?"
                          name="stage"
                          options={stages}
                          value={form.stage}
                          onChange={(value) => updateField("stage", value)}
                          error={errors.stage}
                          required
                          firstRef={(element) => { refs.current.stage = element; }}
                        />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="project-form__step">
                        <ChoiceGroup
                          legend="When would you like to start?"
                          name="timeline"
                          options={timelines}
                          value={form.timeline}
                          onChange={(value) => updateField("timeline", value)}
                          error={errors.timeline}
                          required
                          firstRef={(element) => { refs.current.timeline = element; }}
                        />
                        <div className="project-field project-field--message">
                          <label htmlFor="project-summary">What should be different after this work?</label>
                          <textarea
                            id="project-summary"
                            ref={(element) => { refs.current.summary = element; }}
                            name="summary"
                            value={form.summary}
                            onChange={(event) => updateField("summary", event.target.value)}
                            placeholder="The user problem, current constraints, and the outcome you want to reach..."
                            minLength="30"
                            maxLength="1500"
                            required
                            aria-invalid={Boolean(errors.summary)}
                            aria-describedby="summary-meta"
                          ></textarea>
                          <span className="project-field__meta" id="summary-meta">
                            <small className={errors.summary ? "project-form__error" : ""}>
                              {errors.summary || "Links and technical details can be shared later."}
                            </small>
                            <small>{form.summary.length}/1500</small>
                          </span>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="project-form__step">
                        <div className="project-field-grid">
                          <div className="project-field">
                            <label htmlFor="project-name">Name</label>
                            <input
                              id="project-name"
                              ref={(element) => { refs.current.name = element; }}
                              type="text"
                              name="name"
                              value={form.name}
                              onChange={(event) => updateField("name", event.target.value)}
                              placeholder="Your name"
                              autoComplete="name"
                              required
                              disabled={isSubmitting}
                              aria-invalid={Boolean(errors.name)}
                              aria-describedby={errors.name ? "name-error" : undefined}
                            />
                            {errors.name && <small className="project-form__error" id="name-error">{errors.name}</small>}
                          </div>
                          <div className="project-field">
                            <label htmlFor="project-email">Work email</label>
                            <input
                              id="project-email"
                              ref={(element) => { refs.current.email = element; }}
                              type="email"
                              name="email"
                              value={form.email}
                              onChange={(event) => updateField("email", event.target.value)}
                              placeholder="you@company.com"
                              autoComplete="email"
                              inputMode="email"
                              required
                              disabled={isSubmitting}
                              aria-invalid={Boolean(errors.email)}
                              aria-describedby={errors.email ? "email-error" : undefined}
                            />
                            {errors.email && <small className="project-form__error" id="email-error">{errors.email}</small>}
                          </div>
                        </div>
                        <div className="project-field">
                          <label htmlFor="project-company">Company or product <small>Optional</small></label>
                          <input
                            id="project-company"
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={(event) => updateField("company", event.target.value)}
                            placeholder="Company, team, or product name"
                            autoComplete="organization"
                            maxLength="100"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="project-review">
                          <span>Brief snapshot</span>
                          <dl>
                            <div><dt>Support</dt><dd>{currentEngagement?.title || "Open discovery"}</dd></div>
                            <div><dt>Stage</dt><dd>{stages.find(([id]) => id === form.stage)?.[1]}</dd></div>
                            <div><dt>Start</dt><dd>{timelines.find(([id]) => id === form.timeline)?.[1]}</dd></div>
                            {selectedService && <div><dt>Service</dt><dd>{selectedService.name}</dd></div>}
                            {referenceStudy && <div><dt>Reference</dt><dd>{referenceStudy.name}</dd></div>}
                          </dl>
                        </div>
                      </div>
                    )}

                    {status.type === "error" && <p className="project-form__status" role="alert">{status.message}</p>}
                    <div className="project-form__actions">
                      {step > 1 ? (
                        <button className="project-form__back" type="button" onClick={goBack} disabled={isSubmitting}>
                          <span aria-hidden="true">&larr;</span> Back
                        </button>
                      ) : (
                        <span className="project-form__privacy">Draft autosaves in this browser.</span>
                      )}
                      <button className="project-form__next" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : step === TOTAL_STEPS ? "Save demo receipt" : "Continue"}
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StartProject;
