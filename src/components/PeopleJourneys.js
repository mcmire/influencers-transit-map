import React from "react";
import colorStringify from "color-stringify";

import styles from "./PeopleJourneys.css";

function PersonTenure({ tenureView }) {
  return (
    <>
      <circle
        cx={tenureView.marker.x}
        cy={tenureView.marker.y}
        r={tenureView.marker.radius}
        fill={tenureView.marker.color.toHex()}
      />
      <text
        className={`font-main ${styles.tenureName}`}
        x={tenureView.name.x}
        y={tenureView.name.y}
        textAnchor="end"
      >
        {tenureView.name.label}
      </text>
      <text
        className={`font-main ${styles.tenureRoles}`}
        x={tenureView.roles.x}
        y={tenureView.roles.y}
        textAnchor="end"
      >
        {tenureView.roles.label}
      </text>
    </>
  );
}

function PersonCareerRoute({ personView }) {
  const points = personView.career.companyTenures.flatMap((tenure) => {
    return [tenure.marker, tenure.extension];
  });
  const d = points
    .flatMap((point, pointIndex) => {
      const operation = pointIndex === 0 ? "M" : "L";
      const newPoints = [];

      if (pointIndex > 0 && points[pointIndex - 1].x > point.x) {
        newPoints.push(`M ${point.x} ${points[pointIndex - 1].y}`);
      }

      newPoints.push(`${operation} ${point.x} ${point.y}`);

      return newPoints;
    })
    .join(" ");

  return (
    <g opacity={0.8}>
      <path
        key={`career-route-${personView.id}-1`}
        d={d}
        stroke="white"
        strokeWidth={35}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        key={`career-route-${personView.id}-2`}
        d={d}
        stroke={personView.career.pathColor.toHex()}
        strokeWidth={30}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}

function PersonGroup({ personView }) {
  return (
    <g>
      <PersonCareerRoute
        key={`career-route-${personView.id}`}
        personView={personView}
      />
      {personView.career.companyTenures.map((tenureView, index) => {
        return (
          <PersonTenure
            key={`tenure-${tenureView.id}-${index}`}
            tenureView={tenureView}
          />
        );
      })}
    </g>
  );
}

export default function PeopleJourneys({ view }) {
  return (
    <>
      {view.people.map((personView) => {
        return <PersonGroup key={personView.id} personView={personView} />;
      })}
    </>
  );
}
