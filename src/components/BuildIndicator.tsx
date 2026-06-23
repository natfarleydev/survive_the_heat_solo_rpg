const REPO = 'natfarleydev/survive_the_heat_solo_rpg';

/**
 * Live build/publish indicator (bottom-right), modelled on the badge used at
 * origamiinplaces.neocities.org. It embeds a shields.io GitHub Pages deployment
 * badge: green when the published site is up to date, yellow/blue while GitHub
 * is building & about to publish a new version, red on failure. Clicking it
 * opens the repo's deployment history.
 *
 * `?cacheSeconds=120` keeps shields from over-caching so the pending state
 * actually shows up shortly after a push.
 */
export default function BuildIndicator() {
  const badgeSrc = `https://img.shields.io/github/deployments/${REPO}/github-pages?style=flat&logo=github&label=build&cacheSeconds=120`;

  return (
    <a
      className="build-indicator"
      href={`https://github.com/${REPO}/deployments`}
      target="_blank"
      rel="noopener noreferrer"
      title="Live build status — green = published & up to date; yellow = GitHub is publishing a new version"
    >
      <img src={badgeSrc} alt="GitHub Pages build status" height={20} />
    </a>
  );
}
