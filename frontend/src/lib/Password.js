export function passwordStrengthScore(p) {
  let score = 0;
  if ((p || "").length >= 8) score += 1;
  if (/[A-Z]/.test(p)) score += 1;
  if (/[a-z]/.test(p)) score += 1;
  if (/[0-9]/.test(p)) score += 1;
  if (/[^A-Za-z0-9]/.test(p)) score += 1;
  return score;
}
