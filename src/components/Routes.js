import React from "react";
import colorStringify from "color-stringify";

import styles from "./Routes.css";

export default function Routes({ view }) {
  return (
    <g>
      {view.routes.flatMap((route, routeIndex) => {
        const d = route.stops
          .map((stop, stopIndex) => {
            const operation = stopIndex === 0 ? "M" : "L";
            return `${operation} ${stop.x} ${stop.y}`;
          })
          .join(" ");

        return (
          <g key={route.id} opacity="0.8">
            <path
              key={`${route.id}-1`}
              d={d}
              stroke="white"
              strokeWidth="35"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              key={`${route.id}-2`}
              d={d}
              stroke={route.color.toHex()}
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        );
      })}
    </g>
  );
}
