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

  // Create a client-only route that matches all /sequence/* paths
  // This ensures all sequence pages return 200 status instead of 404
  createPage({
    path: "/sequence/*",
    matchPath: "/sequence/*",
    component: require.resolve("./src/templates/sequence.js"),
    context: {},
  });

  try {
    const apiUrl = process.env.GATSBY_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/api/fastaa`, {
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      console.warn(`API returned status ${response.status}, skipping individual sequence page generation`);
      console.log("Using client-only route fallback for all sequence pages");
      return;
    }

    const sequences = await response.json();

    // Create individual pages for better performance (pre-rendered with data)
    sequences.forEach(sequence => {
      createPage({
        path: `/sequence/${sequence.accession}`,
        component: require.resolve("./src/templates/sequence.js"),
        context: { sequence },
      });
    });

    console.log(`Created ${sequences.length} individual sequence pages + client-only fallback route`);
  } catch (error) {
    console.warn("Error creating individual sequence pages (backend unavailable during build):", error.message);
    console.log("All sequence pages will use client-only route - data will be fetched client-side");
    // Don't throw - allow build to continue with client-only route
  }
};