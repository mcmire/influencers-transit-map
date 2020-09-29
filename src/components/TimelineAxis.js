import { min, max } from "lodash";
import React from "react";

import styles from "./TimelineAxis.css";

export default function TimelineAxis({ view }) {
  return (
    <g>
      <line
        x1={view.padding.x}
        y1={view.padding.y}
        x2={view.width - view.padding.x}
        y2={view.padding.y}
        stroke="black"
      />
      {view.xAxis.ticks.map((tick, index) => {
        return (
          <React.Fragment key={`tick-${index}`}>
            <line
              key={`tick-${index}-line`}
              x1={tick.x}
              y1={view.padding.y - 10}
              x2={tick.x}
              y2={view.padding.y}
              stroke="black"
            />
            <text
              className={`font-main ${styles.text}`}
              key={`tick-${index}-text`}
              x={tick.x}
              y={view.padding.y - 15}
              textAnchor="middle"
            >
              {tick.label}
            </text>
          </React.Fragment>
        );
      })}
    </g>
  );
}
