/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  try {
    const apiUrl = process.env.GATSBY_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${apiUrl}/fastaa`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const sequences = await response.json();
    
    sequences.forEach(sequence => {
      createPage({
        path: `/sequence/${sequence.accession}`,
        component: require.resolve("./src/templates/sequence.js"),
        context: { sequence },
      });
    });
    
    console.log(`Created ${sequences.length} sequence pages`);
  } catch (error) {
    console.error("Error creating sequence pages:", error);
  }
};
