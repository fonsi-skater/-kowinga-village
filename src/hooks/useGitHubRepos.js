// useGitHubRepos.js
// Fetches the given GitHub user's public repositories live from GitHub's
// REST API — no auth needed for public repo listings, but unauthenticated
// requests are rate-limited to 60/hour per IP, so this is meant for a
// personal portfolio's traffic level, not high-volume use.
//
// Returns { repos, loading, error } — repos is null until loaded (or on
// error), so callers can show a loading state and a graceful fallback.

import { useState, useEffect } from 'react';

const GITHUB_USERNAME = 'fonsi-skater';

export function useGitHubRepos() {
  const [repos, setRepos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
          // Most common real-world cause: the 60-requests/hour rate limit
          // for unauthenticated requests being exceeded.
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();
        if (cancelled) return;

        // Filter out forks — a portfolio should show YOUR work, not
        // copies of other people's repos you happened to fork.
        const ownRepos = data.filter((repo) => !repo.fork);
        setRepos(ownRepos);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      }
    }

    fetchRepos();
    return () => {
      cancelled = true; // avoids a "set state on unmounted component" warning
    };
  }, []);

  return { repos, loading, error };
}
