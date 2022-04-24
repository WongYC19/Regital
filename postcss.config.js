module.exports = {
  // plugins: {
  // tailwindcss: {},
  // autoprefixer: {},
  // },
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("tailwindcss/nesting"),
    require("autoprefixer"),
  ],
};
