import React from "react";

import styles from "./Companies.css";

export default function Companies({ view }) {
  return (
    <g>
      {view.companies.map((companyView, companyIndex) => {
        const y =
          (companyView.height + companyView.marginBottom) * companyIndex;
        return (
          <g key={companyIndex}>
            <text
              x={companyView.name.x}
              y={companyView.name.y}
              className={`font-main ${styles.companyName}`}
              fontSize={`${companyView.name.fontSize}px`}
              textAnchor="middle"
              stroke="white"
              strokeWidth={3}
            >
              {companyView.name.label}
            </text>
            <text
              x={companyView.name.x}
              y={companyView.name.y}
              className={`font-main ${styles.companyName}`}
              fontSize={`${companyView.name.fontSize}px`}
              textAnchor="middle"
            >
              {companyView.name.label}
            </text>
            {companyView.players.map((playerView, playerIndex) => {
              return (
                <g key={playerIndex}>
                  <circle
                    cx={playerView.marker.x}
                    cy={playerView.marker.y}
                    r={playerView.marker.radius}
                    fill={playerView.color.toHex()}
                  />
                  <text
                    className={`font-main ${styles.playerName}`}
                    x={playerView.name.x}
                    y={playerView.name.y}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {playerView.name.label}
                  </text>
                  <text
                    className={`font-main ${styles.playerRoles}`}
                    x={playerView.roles.x}
                    y={playerView.roles.y}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {playerView.roles.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
