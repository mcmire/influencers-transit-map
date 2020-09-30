import { cloneDeep, groupBy, keyBy } from "lodash";

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
  const companies = cloneDeep(data.companies);
  const people = cloneDeep(data.people);
  const relationships = cloneDeep(data.relationships);

  const companiesById = keyBy(companies, "id");
  const peopleById = keyBy(people, "id");
  const relationshipsByCompanyId = groupBy(relationships, "company");
  const relationshipsByPersonId = groupBy(relationships, "person");

  companies.forEach((company) => {
    company.relationships = relationshipsByCompanyId[company.id] ?? [];
  });

  people.forEach((person) => {
    person.relationships = relationshipsByPersonId[person.id] ?? [];
  });

  relationships.forEach((relationship) => {
    relationship.company = companiesById[relationship.company];
    relationship.person = peopleById[relationship.person];
    relationship.dateRange = {
      start: parseDate(relationship.dateRange.start),
      end: parseDate(relationship.dateRange.end),
    };
  });

  return { companies, people, relationships };
}
