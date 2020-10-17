import React, { useState } from "react";
import colorStringify from "color-stringify";

import styles from "./PeopleJourneys.css";

function PersonTenure({ tenureView, togglePersonCareerRoute }) {
  return (
    <g style={{ "--color": tenureView.marker.color.toHex() }}>
      <circle
        cx={tenureView.marker.x}
        cy={tenureView.marker.y}
        r={tenureView.marker.radius}
        fill="var(--color)"
      />
      <text
        className={`font-main ${styles.tenure}`}
        onClick={togglePersonCareerRoute}
      >
        <tspan
          className={`font-main ${styles.tenureName}`}
          x={tenureView.name.x}
          y={tenureView.name.y}
        >
          {tenureView.name.label}
        </tspan>
        <tspan
          className={`font-main ${styles.tenureRoles}`}
          x={tenureView.name.x}
          y={tenureView.roles.y}
        >
          {tenureView.roles.label}
        </tspan>
      </text>
    </g>
  );
}

function PersonCareerRoute({ personView, isVisible }) {
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
    <g opacity={isVisible ? 0.5 : 0}>
      <path
        key={`career-route-${personView.id}-1`}
        d={d}
        stroke="white"
        strokeWidth={35}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pointerEvents="none"
      />
      <path
        key={`career-route-${personView.id}-2`}
        d={d}
        stroke={personView.career.pathColor.toHex()}
        strokeWidth={30}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pointerEvents="none"
      />
    </g>
  );
}

function PersonGroup({
  personView,
  isPersonCareerRouteVisible,
  togglePersonCareerRouteFor,
}) {
  return (
    <g>
      <PersonCareerRoute
        key={`career-route-${personView.id}`}
        personView={personView}
        isVisible={isPersonCareerRouteVisible}
      />
      {personView.career.companyTenures.map((tenureView, index) => {
        return (
          <PersonTenure
            key={`tenure-${tenureView.id}-${index}`}
            tenureView={tenureView}
            togglePersonCareerRoute={() =>
              togglePersonCareerRouteFor(personView)
            }
          />
        );
      })}
    </g>
  );
}

export default function PeopleJourneys({ view }) {
  const [visiblePersonViewsById, setVisiblePersonViewsById] = useState({});
  const togglePersonCareerRouteFor = (personView) => {
    if (visiblePersonViewsById[personView.id]) {
      setVisiblePersonViewsById({
        ...visiblePersonViewsById,
        [personView.id]: false,
      });
    } else {
      setVisiblePersonViewsById({
        ...visiblePersonViewsById,
        [personView.id]: true,
      });
    }
  };

  return (
    <>
      {view.people.map((personView) => {
        return (
          <PersonGroup
            key={personView.id}
            personView={personView}
            isPersonCareerRouteVisible={visiblePersonViewsById[personView.id]}
            togglePersonCareerRouteFor={togglePersonCareerRouteFor}
          />
        );
      })}
    </>
  );
}
