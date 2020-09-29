import { clone } from "lodash-es";

function parseDate(string) {
  const match = string.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);

  if (match != null) {
    if (match[3] != null) {
      return new Date(
        parseInt(match[1], 10),
        parseInt(match[2], 10) - 1,
        parseInt(match[3], 10)
      );
    } else if (match[2] != null) {
      return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, 1);
    } else {
      return new Date(parseInt(match[1], 10), 0, 1);
    }
  } else {
    throw new Error(`Could not parse "${string}" as a date!`);
  }
}

export default function prepareModel(data) {
  const normalizedRelationships = data.relationships.map((relationship) => {
    return {
      ...relationship,
      dateRange: {
        start: parseDate(relationship.dateRange.start),
        end: parseDate(relationship.dateRange.end),
      },
    };
  });

  return {
    companies: clone(data.companies),
    people: clone(data.people),
    relationships: normalizedRelationships,
  };
}
