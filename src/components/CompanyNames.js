import React from "react";

import styles from "./CompanyNames.css";

export default function CompanyNames({ view }) {
  return (
    <>
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
              dangerouslySetInnerHTML={{ __html: companyView.name.label }}
            ></text>
            <text
              x={companyView.name.x}
              y={companyView.name.y}
              className={`font-main ${styles.companyName}`}
              fontSize={`${companyView.name.fontSize}px`}
              textAnchor="middle"
              dangerouslySetInnerHTML={{ __html: companyView.name.label }}
            />
          </g>
        );
      })}
    </>
  );
}
