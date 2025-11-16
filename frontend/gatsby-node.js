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
    const apiUrl = process.env.GATSBY_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/api/fastaa`, {
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      console.warn(`API returned status ${response.status}, skipping sequence page generation`);
      return;
    }
    
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
    console.warn("Error creating sequence pages (backend unavailable during build):", error.message);
    console.log("Sequence pages will be skipped - data will be fetched client-side");
    // Don't throw - allow build to continue without sequence pages
  }
};