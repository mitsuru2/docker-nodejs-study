declare module '*/_build' {
  export const buildMetadata: {
    readonly gitSha: string;
    readonly gitTag: string | null;
    readonly timestamp: string;
  };
}
