import { useEffect } from "react";

const SITE_NAME = "M-Agency";
const DEFAULT_TITLE = "M-Agency - Frontend Engineering Portfolio";
const DEFAULT_DESCRIPTION =
  "Senior frontend engineering portfolio featuring product interfaces, case studies, and practical engineering insights.";
const DEFAULT_SITE_URL = "https://magency.vercel.app";

const getOrCreateMeta = (attribute, key) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    element.dataset.seoManaged = "true";
    document.head.appendChild(element);
  }

  return element;
};

const updateMeta = (attribute, key, value) => {
  const element = getOrCreateMeta(attribute, key);
  element.setAttribute("content", value);
};

const toAbsoluteUrl = (value, baseUrl) => {
  if (!value) return "";

  try {
    return new URL(value, baseUrl).href;
  } catch {
    return "";
  }
};

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = "website",
  robots = "index, follow",
}) => {
  useEffect(() => {
    const configuredSiteUrl = String(
      import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL
    ).replace(/\/$/, "");
    const canonicalUrl = new URL(
      path || window.location.pathname,
      configuredSiteUrl
    );
    canonicalUrl.search = "";
    canonicalUrl.hash = "";

    const canonical = canonicalUrl.href;
    const absoluteImage = toAbsoluteUrl(image, configuredSiteUrl);
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    document.title = title;
    canonicalLink.setAttribute("href", canonical);

    updateMeta("name", "description", description);
    updateMeta("name", "robots", robots);
    updateMeta("property", "og:type", type);
    updateMeta("property", "og:site_name", SITE_NAME);
    updateMeta("property", "og:title", title);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:url", canonical);
    updateMeta("name", "twitter:card", absoluteImage ? "summary_large_image" : "summary");
    updateMeta("name", "twitter:title", title);
    updateMeta("name", "twitter:description", description);

    if (absoluteImage) {
      updateMeta("property", "og:image", absoluteImage);
      updateMeta("name", "twitter:image", absoluteImage);
    } else {
      document.head
        .querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
        .forEach((element) => element.remove());
    }
  }, [description, image, path, robots, title, type]);

  return null;
};

export default Seo;
