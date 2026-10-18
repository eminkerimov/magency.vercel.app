import adrianPhoto from "../assets/img/author-frontend.jpg";
import fernandoPhoto from "../assets/img/author-devops.jpg";
import adedayoPhoto from "../assets/img/author-career.jpg";
import naratePhoto from "../assets/img/author-backend.jpg";
import mayaPhoto from "../assets/img/testimonial-maya.jpg";
import adrianAvatar from "../assets/img/avatar-adrian.jpg";
import narateAvatar from "../assets/img/avatar-narate.jpg";
import fernandoAvatar from "../assets/img/avatar-fernando.jpg";
import adedayoAvatar from "../assets/img/avatar-adedayo.jpg";
import mayaAvatar from "../assets/img/avatar-maya.jpg";

// Locally bundled stock portraits for the fictional portfolio contributors.
// Unsplash image IDs: Adrian 1506794778202-cad84cf45f1d,
// Fernando 1696456254433-a03ae02443a6, Maya 1616639943825-e0fbad20a3d3.
// Pexels photo IDs: Narate 9999322 (Kenzhar Sharap), Adedayo 9533891 (Andy Coffie).
const authorEditorialPortraitsByName = {
  "Adrian Thomas": adrianPhoto,
  "Narate Ketram": naratePhoto,
  "Fernando Comet": fernandoPhoto,
  "Adedayo Saheed": adedayoPhoto,
  "Maya Chen": mayaPhoto,
};

const authorPortraitsByName = {
  "Adrian Thomas": adrianAvatar,
  "Narate Ketram": narateAvatar,
  "Fernando Comet": fernandoAvatar,
  "Adedayo Saheed": adedayoAvatar,
  "Maya Chen": mayaAvatar,
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

export function getAuthorPortrait(name, variant = "avatar") {
  if (typeof name !== "string") return "";

  const portraits = variant === "editorial"
    ? authorEditorialPortraitsByName
    : authorPortraitsByName;

  return portraits[name.trim()] || "";
}
