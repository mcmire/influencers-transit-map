import React from "react";

import model from "../model";
import buildModel from "../util/buildModel";
import buildView from "../util/buildView";
import styles from "./App.css";
import TimelineAxis from "./TimelineAxis";
import CompanyNames from "./CompanyNames";
import PeopleJourneys from "./PeopleJourneys";

const width = 1700;
const height = 5000;
const padding = { x: 100, y: 50 };
const view = buildView(buildModel(model), { width, height, padding });

export default function App() {
  return (
    <svg
      width={view.width}
      height={view.height}
      className={styles.root}
      viewBox={`0 0 ${view.width} ${view.height}`}
    >
      <TimelineAxis view={view} />
      <PeopleJourneys view={view} />
      <CompanyNames view={view} />
    </svg>
  );
}
