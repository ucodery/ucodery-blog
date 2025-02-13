export default {
  tags: ["posts", "blogs"],
  layout: "layouts/post.njk",
  eleventyComputed: {
    image: {
      image_src: (data) => data.feature_image,
      image_attribute: (data) => data.feature_image_attribute,
      image_description: (data) => data.feature_image_description,
    },
  },
};
