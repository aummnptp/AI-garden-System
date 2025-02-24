declare module 'convex-hull' {
    type Edge = [number, number];
    function convexHull(points: number[][]): Edge[];
    export = convexHull;
  }
  