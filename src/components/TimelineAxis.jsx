import { min, max } from "lodash-es";
import React from "react";

import styles from "./TimelineAxis.module.css";

export default function TimelineAxis({ view }) {
  return (
    <g>
      <line
        x1={view.padding}
        y1={view.padding}
        x2={view.width - view.padding}
        y2={view.padding}
        stroke="black"
      />
      {view.xAxisTicks.map((tick, index) => {
        return (
          <React.Fragment key={`tick-${index}`}>
            <line
              key={`tick-${index}-line`}
              x1={tick.x}
              y1={view.padding - 10}
              x2={tick.x}
              y2={view.padding}
              stroke="black"
            />
            <text
              className={styles.text}
              key={`tick-${index}-text`}
              x={tick.x}
              y={view.padding - 15}
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
