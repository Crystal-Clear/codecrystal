var GitHubApi = require('github');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    // pathPrefix: "/api/v3", // for some GHEs; none for GitHub
    timeout: 15000,
    headers: {
        "user-agent": "codecrystal" // GitHub is happy with a unique user agent
    }
});

github.authenticate({
    type: "oauth",
    key: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
});

module.exports = github;
