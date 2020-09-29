import React from "react";

import styles from "./Companies.module.css";

export default function Companies({ view }) {
  return (
    <g transform={`translate(0 ${view.padding.y + view.xAxis.marginBottom})`}>
      {view.companies.slice(0, 1).map((company, companyIndex) => {
        const y = (company.height + company.marginBottom) * companyIndex;
        return (
          <g key={companyIndex} transform={`translate(0 ${y})`}>
            <text
              x={company.name.x}
              y={company.name.y}
              className={`font-main ${styles.companyName}`}
              fontSize={`${company.name.fontSize}px`}
            >
              {company.name.label}
            </text>
            {company.players.map((player, playerIndex) => {
              return (
                <g key={playerIndex}>
                  <circle
                    cx={player.marker.x}
                    cy={player.marker.y}
                    r={player.marker.radius}
                    fill="red"
                  />
                  <text
                    className={`font-main ${styles.playerName}`}
                    x={player.name.x}
                    y={player.name.y}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {player.name.label}
                  </text>
                  <text
                    className={`font-main ${styles.playerRoles}`}
                    x={player.roles.x}
                    y={player.roles.y}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {player.roles.label}
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
