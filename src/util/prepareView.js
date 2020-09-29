import { max, min, range, sum } from "lodash";
import {
  getDayOfYear,
  getDaysInMonth,
  getDaysInYear,
  startOfMonth,
  startOfYear,
} from "date-fns";

import emsToPixels from "./emsToPixels";

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

function buildXAxis(model, { width, padding }) {
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
        (width - padding.x * 2) +
      padding.x
    );
  };

  const ticks = range(
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
    xAxis: { ticks: ticks, marginBottom: 50 },
    mapToX: mapToX,
  };
}

function buildCompanies(model, mapToX) {
  return model.companies.reduce((companies, companyModel) => {
    const relationships = model.relationships.filter(
      (relationship) => relationship.company === companyModel.id
    );

    if (relationships.length > 0) {
      const companyNameView = {};
      companyNameView.label = companyModel.name;
      companyNameView.fontSize = emsToPixels(1.6);
      companyNameView.lineHeight = companyNameView.fontSize;
      companyNameView.marginBottom = emsToPixels(0.5, {
        relativeTo: companyNameView.fontSize,
      });

      const playerPaddingBottom = emsToPixels(1.25, companyNameView.fontSize);

      const playerViews = relationships.reduce(
        (array, relationship, relationshipIndex) => {
          const lastPlayerView =
            array.length > 0 ? array[array.length - 1] : null;
          const person = model.people.find(
            (person) => person.id === relationship.player
          );
          if (person == null) {
            throw new Error(`Could not find person by ${relationship.player}`);
          }
          const name = {};
          const roles = {};
          const marker = {};

          name.y =
            companyNameView.lineHeight +
            companyNameView.marginBottom +
            (lastPlayerView != null
              ? (lastPlayerView.height + playerPaddingBottom) *
                relationshipIndex
              : 0);
          name.label = person.name;
          name.fontSize = emsToPixels(1);
          name.lineHeight = emsToPixels(1.2, { relativeTo: name.fontSize });

          roles.y = name.y + name.lineHeight;
          roles.fontSize = emsToPixels(0.8);
          roles.label = relationship.roles.join(", ");
          roles.lineHeight = emsToPixels(1.2, { relativeTo: roles.fontSize });

          marker.x = mapToX(relationship.dateRange.start);
          marker.y = roles.y - (roles.y - name.y) / 2;
          marker.radius = 10;

          name.x = marker.x - marker.radius - 10;
          roles.x = marker.x - marker.radius - 10;

          const height = name.lineHeight + roles.lineHeight;

          return array.concat([{ height, marker, name, roles }]);
        },
        []
      );

      const markerXs = playerViews.map((playerView) => playerView.marker.x);
      companyNameView.x = sum(markerXs) / markerXs.length;

      const lastPlayerView =
        playerViews.length > 0 ? playerViews[playerViews.length - 1] : null;
      // NOTE: This isn't totally accurate but it's good enough for now
      const height =
        lastPlayerView != null
          ? lastPlayerView.roles.y + lastPlayerView.roles.lineHeight
          : 0;

      return companies.concat([
        {
          name: companyNameView,
          players: playerViews,
          height: height,
          marginBottom: emsToPixels(4),
        },
      ]);
    } else {
      return companies;
    }
  }, []);
}

export default function prepareView(model, { width, height, padding }) {
  const { xAxis, mapToX } = buildXAxis(model, { width, padding });
  const companies = buildCompanies(model, mapToX);

  return {
    xAxis,
    companies,
    width,
    height,
    padding,
    model,
  };
}
