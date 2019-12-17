const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("topLevelPage", function(collection) {
    let pages = collection.getFilteredByTag("topLevelPage");
    return pages.sort(function(a, b){
      return a.data.weight - b.data.weight;
    })
  });

  eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.html');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.html');

  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/serviceworker.js");

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  return {
    dir: {
      input: "src"
    }
  };
};
