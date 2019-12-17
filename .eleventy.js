const CleanCSS = require("clean-css");
const Terser = require("terser");

module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("post", function (collection) {
    let pages = collection.getFilteredByTag("post");
    return pages.sort(function (a, b) {
      return b.date - a.date;
    })
  });

  eleventyConfig.addCollection("project", function (collection) {
    let pages = collection.getFilteredByTag("project");
    return pages.sort(function (a, b) {
      return a.data.weight - b.data.weight;
    })
  });

  eleventyConfig.addCollection("topLevelPage", function (collection) {
    let pages = collection.getFilteredByTag("topLevelPage");
    return pages.sort(function (a, b) {
      return a.data.weight - b.data.weight;
    })
  });

  eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.html');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.html');

  eleventyConfig.addLiquidFilter("date", function (date) {
    return new Date(date).toUTCString().split(' 00:00')[0];
  });

  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/serviceworker.js");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = Terser.minify(code);
    if (minified.error) {
      console.log("Terser error: ", minified.error);
      return code;
    }

    return minified.code;
  });

  return {
    dir: {
      input: "src"
    }
  };
};
