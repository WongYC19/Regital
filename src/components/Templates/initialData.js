export const skillLevels = {
  novice: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

const profile = {
  description: "About yourself",
  email: "Your email address",
  githubURL: "",
  address: "Your mailing address",
  linkedinURL: "",
};

const skills = [
  { name: "Sample Skill", level: "intermediate" },
  // { name: "CSS 3", level: "intermediate" },
];

const languages = [{ name: "English", level: "novice" }];

const project = [
  {
    thumbnail:
      "https://designshack.net/wp-content/uploads/placeholder-image-368x246.png",
    category: "Project Category",
    topic: "Project Topic",
    description: "Project description",
  },
];

const experience = [
  {
    title: "Job Title",
    institution: "Company Name",
    periodStart: "2020",
    periodEnd: "Present",
    description: "Job description",
  },
];

const education = [
  {
    title: "Bachelor",
    institution: "University of Sample",
    periodStart: "2017",
    periodEnd: "2019",
    description: "Education description",
  },
];

const initialData = {
  profile,
  skills,
  project,
  experience,
  education,
  languages,
};

export default initialData;
