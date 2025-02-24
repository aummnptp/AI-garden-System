
// polygonUtil.ts

import convexHull from 'convex-hull';

export interface Detection {
  label: string;
  position: { [key: string]: number }; // เช่น { "x1": 1038, "y1": 282, "x2": 1033, "y2": 283, ... }
}

export interface PolygonDetection {
  label: string;
  polygons: number[][][]; // แต่ละ polygon เป็น array ของ [x, y] points
}

/**
 * แปลง detection ที่มีพิกัดอยู่ใน key "position" 
 * ให้เป็น polygon โดยคำนวณ convex hull จากทุกจุดใน position
 */
export function convertDetectionToPolygon(detection: Detection): number[][] {
  const pos = detection.position;
  const points: number[][] = [];
  let idx = 1;
  while (pos.hasOwnProperty(`x${idx}`) && pos.hasOwnProperty(`y${idx}`)) {
    const x = pos[`x${idx}`];
    const y = pos[`y${idx}`];
    points.push([x, y]);
    idx++;
  }

  // ถ้าจำนวนจุดไม่เพียงพอ ให้คืนค่า points เดิม
  if (points.length < 3) {
    return points;
  }

  // คำนวณ convex hull ด้วยไลบรารี convex-hull
  // convexHull(points) คืนค่าเป็น array ของ edge pairs ([i, j])
  const hullEdges = convexHull(points);
  
  // รวบรวม index ของจุดที่อยู่ใน convex hull
  const hullIndices = new Set<number>();
  hullEdges.forEach(([i, j]) => {
    hullIndices.add(i);
    hullIndices.add(j);
  });

  // ดึงจุดจาก index ที่ได้ แล้วคืนค่าเป็น array ของ [x, y]
  const hullPoints = Array.from(hullIndices).map((i) => points[i]);
  return hullPoints;
}

/**
 * แปลงรายการ detections ที่มีพิกัดอยู่ใน key "position"
 * ให้เป็นรูปแบบที่ใช้ key "polygons" โดยแต่ละ detection จะมี array ของ polygon(s)
 */
export function convertDetectionsToPolygons(detections: Detection[]): PolygonDetection[] {
  return detections.map((detection) => {
    const polygons = [convertDetectionToPolygon(detection)];
    return {
      label: detection.label,
      polygons,
    };
  });
}
