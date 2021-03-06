/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

 // You can delete this file if you're not using it

 const _ = require('lodash');
 const Promise = require('bluebird');
 const path = require('path');
 const slash = require('slash');

 exports.createPages = ({ graphql, actions}) => {
   const { createPage } = actions;
   return new Promise((resolve, reject) => {
     graphql(
      `
        {
          allWordpressPost {
            edges {
              node {
                title
                content
                slug
              }
            }
          }
        }
      `
     ).then(result => {
      if (result.errors) {
        console.log("createPages Error :'(")
        console.log(result.errors);
        reject(result.errors);
      }
      const postTemplate = path.resolve("./src/layouts/post-template.js");
      // We want to create a detailed page for each
      // post node. We'll just use the WordPress Slug for the slug.
      // The Post ID is prefixed with 'POST_'
      _.each(result.data.allWordpressPost.edges, edge => {
        createPage({
          path: `/post/${edge.node.slug}/`,
          component: slash(postTemplate),
          context: {
            allPostData: edge.node,
          },
        });
      });
      resolve();
    });

   });
 };