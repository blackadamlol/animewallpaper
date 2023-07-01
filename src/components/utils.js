export function levenshteinDistance(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));
  
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
  
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }
  
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] !== b[j - 1] ? 1 : 0;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
  
    return dp[m][n];
  }
  