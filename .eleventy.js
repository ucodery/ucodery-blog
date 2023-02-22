require("dotenv").config();

const cleanCSS = require("clean-css");
const fs = require("fs");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const localImages = require("eleventy-plugin-local-images");
const lazyImages = require("eleventy-plugin-lazyimages");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const htmlMinTransform = require("./src/transforms/html-min-transform.js");

module.exports = function(config) {
  // Copy the `img` and `css` folders to the output
  config.addPassthroughCopy("src/img");
  config.addPassthroughCopy("src/css");

  // Minify HTML
  config.addTransform("htmlmin", htmlMinTransform);

  // Assist RSS feed template
  config.addPlugin(pluginRSS);

  // Apply performance attributes to images
  config.addPlugin(lazyImages, {
    cacheFile: ""
  });

  // Inline CSS
  config.addFilter("cssmin", code => {
    return new cleanCSS({}).minify(code).styles;
  });

  config.addFilter("getReadingTime", text => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  // Date formatting filter
  config.addFilter("htmlDateString", dateObj => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  config.addFilter("relativeDayString", dateObj => {
    var post_date = new Date(dateObj).setHours(0, 0, 0, 0);
    var today = new Date().setHours(0, 0, 0, 0);
    var drift = today - post_date
    const ms_day = (24 * 60 * 60 * 1000);
    if(post_date == today) {
      return "today"
    }
    else if(drift < (ms_day * 7) && drift > 0) {
      return Math.floor(drift / ms_day).toString() + " days ago"
    }
    else {
      return new Date(dateObj).toISOString().split("T")[0]
    }
  });

  // Don't ignore the same files ignored in the git repo
  config.setUseGitIgnore(false);

  // Display 404 page in BrowserSnyc
  config.setBrowserSyncConfig({
    callbacks: {
      ready: (err, bs) => {
        const content_404 = fs.readFileSync("dist/404.html");

        bs.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  config.addPlugin(syntaxHighlight);

  // Eleventy configuration
  return {
    dir: {
      input: "src",
      output: "dist"
    },

    // Files read by Eleventy, add as needed
    templateFormats: ["njk", "md", "txt"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
