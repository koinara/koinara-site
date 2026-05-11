export const recordOrigins = ['internal', 'external', 'mixed'] as const;

export const sourceRefKinds = [
  'aigora-record',
  'aigora-path',
  'github-pr',
  'external-url',
  'external-record',
  'koinara-record',
] as const;

export const internalSourceKinds = ['aigora-record', 'aigora-path'] as const;
export const externalSourceKinds = ['github-pr', 'external-url', 'external-record'] as const;

export const sourceRefPattern = `^(${sourceRefKinds.join('|')}):\\S+$`;
