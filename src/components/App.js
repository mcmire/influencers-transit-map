import React from "react";

import model from "../model";
import prepareModel from "../util/prepareModel";
import prepareView from "../util/prepareView";
import styles from "./App.css";
import TimelineAxis from "./TimelineAxis";
import Companies from "./Companies";
import Routes from "./Routes";

const width = 1000;
const height = 1000;
const padding = { x: 100, y: 50 };
const view = prepareView(prepareModel(model), { width, height, padding });

export default function App() {
  return (
    <svg
      width={view.width}
      height={view.height}
      className={styles.root}
      viewBox={`0 0 ${view.width} ${view.height}`}
    >
      <TimelineAxis view={view} />
      <Companies view={view} />
      <Routes view={view} />
    </svg>
  );
}
