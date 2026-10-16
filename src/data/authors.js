import adrianPhoto from "../assets/img/author-frontend.jpg";
import fernandoPhoto from "../assets/img/author-devops.jpg";
import adedayoPhoto from "../assets/img/author-career.jpg";
import naratePhoto from "../assets/img/author-backend.jpg";
import mayaPhoto from "../assets/img/testimonial-maya.jpg";

const authorPortraitsByName = {
  "Adrian Thomas": adrianPhoto,
  "Narate Ketram": naratePhoto,
  "Fernando Comet": fernandoPhoto,
  "Adedayo Saheed": adedayoPhoto,
  "Maya Chen": mayaPhoto,
};

export const authorProfilesByName = {
  "Adrian Thomas": {
    name: "Adrian Thomas",
    role: "Frontend Architect",
    focus: "Frontend",
    bio: "Explores React architecture, performance, and testing practices that keep complex interfaces maintainable.",
  },
  "Narate Ketram": {
    name: "Narate Ketram",
    role: "Backend Engineer",
    focus: "Backend & data",
    bio: "Writes about dependable Node.js services, type-safe APIs, and practical PostgreSQL performance.",
  },
  "Fernando Comet": {
    name: "Fernando Comet",
    role: "Platform Engineer",
    focus: "Platform",
    bio: "Focuses on observable cloud systems and delivery pipelines that help small teams operate software confidently.",
  },
  "Adedayo Saheed": {
    name: "Adedayo Saheed",
    role: "Engineering Leader",
    focus: "Leadership",
    bio: "Covers technical leadership, constructive incident reviews, and the communication habits behind effective engineering teams.",
  },
  "Maya Chen": {
    name: "Maya Chen",
    role: "UI Systems Engineer",
    focus: "Design systems",
    bio: "Writes about modern CSS, design systems, and sustainable ways to structure frontend styling.",
  },
};

const genericAuthorProfile = {
  name: "Magency Contributor",
  role: "Engineering Author",
  focus: "Engineering",
  bio: "Shares practical perspectives on building and maintaining modern software.",
};

export function getAuthorProfile(name) {
  if (typeof name !== "string") {
    return genericAuthorProfile;
  }

  return authorProfilesByName[name.trim()] || genericAuthorProfile;
}

export function getAuthorPortrait(name) {
  if (typeof name !== "string") return "";

  return authorPortraitsByName[name.trim()] || "";
}
