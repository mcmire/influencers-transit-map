import { max, min, range } from "lodash";
import {
  addMonths,
  addYears,
  min as minDate,
  max as maxDate,
  startOfMonth,
  startOfYear,
} from "date-fns";

import emsToPixels from "../emsToPixels";

const X_TICK_DIVISION = 5; // years

function roundToNearest(number, division, direction) {
  const methodName = direction === "up" ? "ceil" : "floor";
  return Math[methodName](number / division) * division;
}

function roundToNearestMonth(date, direction) {
  if (direction === "up") {
    return startOfMonth(addMonths(date, 1));
  } else {
    return startOfMonth(date);
  }
}

function roundToNearestYear(date, direction) {
  if (direction === "up") {
    return startOfYear(addYears(date, 1));
  } else {
    return startOfYear(date);
  }
}

function roundToNearestNYears(date, numberOfYears, direction) {
  const yearRoundedDate = roundToNearestYear(
    roundToNearestMonth(date),
    direction
  );
  const roundedYear = roundToNearest(
    yearRoundedDate.getFullYear(),
    numberOfYears,
    direction
  );
  return new Date(roundedYear, 0, 1);
}

function roundUpToNearestNYears(date, numberOfYears) {
  return roundToNearestNYears(date, numberOfYears, "up");
}

function roundDownToNearestNYears(date, numberOfYears) {
  return roundToNearestNYears(date, numberOfYears, "down");
}

export default function buildXAxis(model, { width, padding }) {
  const _minDate = minDate(
    model.relationships.map((relationship) => relationship.dateRange.start)
  );
  const roundedMinDate = roundDownToNearestNYears(_minDate, X_TICK_DIVISION);
  const _maxDate = maxDate(
    model.relationships.map((relationship) => relationship.dateRange.end)
  );
  const roundedMaxDate = roundUpToNearestNYears(_maxDate, X_TICK_DIVISION);
  console.debug(
    "_minDate",
    _minDate,
    "_maxDate",
    _maxDate,
    "roundedMinDate",
    roundedMinDate,
    "roundedMaxDate",
    roundedMaxDate
  );
  const timestampRange = roundedMaxDate.getTime() - roundedMinDate.getTime();

  const mapTo = {
    x(dateOrTimestamp) {
      const timestamp =
        dateOrTimestamp instanceof Date
          ? dateOrTimestamp.getTime()
          : dateOrTimestamp;
      return (
        ((timestamp - roundedMinDate.getTime()) / timestampRange) *
          (width - padding.x * 2) +
        padding.x
      );
    },
    y(y) {
      return padding.y + xAxis.marginBottom + y;
    },
  };

  const ticks = range(
    roundedMinDate.getFullYear(),
    roundedMaxDate.getFullYear() + 1,
    X_TICK_DIVISION
  ).map((year) => {
    return {
      x: mapTo.x(new Date(year, 0, 1)),
      label: year.toString(),
    };
  });

  const xAxis = { ticks: ticks, marginBottom: emsToPixels(3.5) };

  return { xAxis, mapTo };
}
