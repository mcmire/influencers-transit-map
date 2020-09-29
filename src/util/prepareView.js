import { max, min, range } from "lodash-es";
import {
  getDayOfYear,
  getDaysInMonth,
  getDaysInYear,
  startOfMonth,
  startOfYear,
} from "date-fns";

//const YEARS = 1000 * 60 * 60 * 24 * 365;
const X_TICK_DIVISION = 5; // years

function roundToNearest(number, division) {
  return Math.round(number / division) * division;
}

function roundToNearestMonth(date) {
  if (date.getDate() >= getDaysInMonth(date.getMonth()) / 2) {
    return startOfMonth(addMonths(date, 1));
  } else {
    return startOfMonth(date);
  }
}

function roundToNearestYear(date) {
  if (getDayOfYear(date) > getDaysInYear(date.getFullYear()) / 2) {
    return startOfYear(addYears(date, 1));
  } else {
    return startOfYear(date);
  }
}

function roundToNearestNYears(date, numberOfYears) {
  const yearRoundedDate = roundToNearestYear(roundToNearestMonth(date));
  const roundedYear = roundToNearest(
    yearRoundedDate.getFullYear(),
    numberOfYears
  );
  return new Date(roundedYear, 0, 1);
}

export default function prepareView(model, { width, height, padding }) {
  const minDate = min(
    model.relationships.map((relationship) =>
      roundToNearestNYears(relationship.dateRange.start, X_TICK_DIVISION)
    )
  );
  const maxDate = max(
    model.relationships.map((relationship) =>
      roundToNearestNYears(relationship.dateRange.end, X_TICK_DIVISION)
    )
  );
  const timestampRange = maxDate.getTime() - minDate.getTime();

  const mapToX = (dateOrTimestamp) => {
    const timestamp =
      dateOrTimestamp instanceof Date
        ? dateOrTimestamp.getTime()
        : dateOrTimestamp;
    return (
      ((timestamp - minDate.getTime()) / timestampRange) *
        (width - padding * 2) +
      padding
    );
  };

  const xAxisTicks = range(
    minDate.getFullYear(),
    maxDate.getFullYear() + 1,
    X_TICK_DIVISION
  ).map((year) => {
    return {
      x: mapToX(new Date(year, 0, 1)),
      label: year.toString(),
    };
  });

  return {
    xAxisTicks,
    mapToX,
    width,
    height,
    padding,
    model,
  };
}
