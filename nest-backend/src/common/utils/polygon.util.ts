const convexHull = require('convex-hull');

interface Detection {
  label: string;
  // key-value ที่เก็บพิกัด เช่น x1, y1, x2, y2, ...
  [key: string]: any;
}

interface PolygonDetection {
  label: string;
  polygons: number[][][];
}

function convertDetectionToPolygon(detection: Detection): number[][] {
  const points: number[][] = [];
  let idx = 1;
  while (detection[`x${idx}`] !== undefined && detection[`y${idx}`] !== undefined) {
    points.push([detection[`x${idx}`], detection[`y${idx}`]]);
    idx++;
  }
  // ตรวจสอบว่ามีจุดเพียงพอ
  if (points.length < 3) {
    return points;
  }
  // ใช้ไลบรารี convexHull (ไลบรารีนี้รับ index array)
  // ขั้นแรกเราสร้าง index list ของจุด
  const pointIndices = points.map((_, i) => i);
  const hullIndices = convexHull(points);
  // hullIndices จะเป็น array ของ [i, j] pairs ของแต่ละ edge
  // เราสามารถดึง index ที่อยู่ใน convex hull โดยเรียงลำดับได้ (คุณอาจต้องจัดเรียงเพิ่มเติม)
  const hullPointSet = new Set<number>();
  hullIndices.forEach(pair => {
    hullPointSet.add(pair[0]);
    hullPointSet.add(pair[1]);
  });
  const hullPoints = Array.from(hullPointSet).map(i => points[i]);
  return hullPoints;
}

export function convertDetectionsToPolygons(detections: Detection[]): PolygonDetection[] {
  return detections.map(detection => {
    const polygons = [convertDetectionToPolygon(detection)]; // หากมีหลาย component อาจทำเพิ่มเติม
    return {
      label: detection.label,
      polygons,
    };
  });
}
