import {
  cloneDeep,
  groupBy,
  isEmpty,
  isPlainObject,
  kebabCase,
  keyBy,
  lastIndexOf,
} from "lodash";

import parseDateString, { canParseDateString } from "./parseDateString";

class ModelBuilder {
  static PROCESSORS = [
    [/^(.+) is a source with URL "(.+?)"\.$/, "processNewSourceFact"],
    [
      /^(.+) is an? (organization|show|club|movie|scene)\.$/,
      "processNewCompanyFact",
    ],
    [
      /^When displaying (?:[Tt]he )?(.+), use "(.+)"\.$/,
      "processCompanyDisplayNameFact",
    ],
    [/^"(.+)" is short for (.+)\.$/, "processAliasFact"],
    [/^(.+) is a person\.$/, "processNewPersonFact"],
    [
      /^(?<personDescriptor>.+) (?:was|has been) (?<rolesAtCompanyDuringTimeframe>.+?)(?: \(sources?: (?<rawSources>.+)\))?\.$/,
      "processNewRelationshipFact",
    ],
  ];

  constructor(data) {
    this.data = {
      sources: [],
      companies: [],
      people: [],
      relationships: [],
    };
  }

  processFact(fact) {
    const processorFindingResult = this.#findProcessorFor(fact);

    if (processorFindingResult != null) {
      if (typeof this[processorFindingResult.processorName] !== "function") {
        throw new Error(
          `Could not find processor method: ${processorFindingResult.processorName}`
        );
      }

      const processorResult = this[processorFindingResult.processorName](
        fact,
        processorFindingResult.match
      );

      if (processorResult === false) {
        throw new Error(`Don't know how to process fact: ${fact}`);
      } else {
        return processorResult;
      }
    } else {
      throw new Error(`Don't know how to process fact: ${fact}`);
    }
  }

  processNewSourceFact(fact, match) {
    this.data.sources.push({ id: match[1], url: match[2], aliases: [] });
  }

  processNewCompanyFact(fact, match) {
    const id = this.#generateIdForNewObjectIn(this.data.companies, match[1]);
    const displayName =
      match[2] === "show" || match[2] === "movie" ? `*${match[1]}*` : match[1];

    this.data.companies.push({
      id: id,
      name: match[1],
      displayName: displayName,
      aliases: [],
    });
  }

  processCompanyDisplayNameFact(fact, match) {
    const company = this.#findObjectByOrThrow(match[1], {
      collection: this.data.companies,
      type: "company",
    });

    company.displayName = match[2];
  }

  processAliasFact(fact, match) {
    const object = this.#findObjectByOrThrow(match[2]);

    object.aliases.push(match[1]);
  }

  processNewPersonFact(fact, match) {
    const id = this.#generateIdForNewObjectIn(this.data.people, match[1]);

    this.data.people.push({
      id: id,
      name: match[1],
      displayName: match[1],
      aliases: [],
    });
  }

  processNewRelationshipFact(fact, match) {
    const personDescriptor = match.groups.personDescriptor;
    const rolesAtCompanyDuringTimeframe =
      match.groups.rolesAtCompanyDuringTimeframe;
    const sourceDescriptors = this.#parseSources(match.groups.rawSources);
    const {
      startDate,
      endDate,
      rolesAtCompany,
    } = this.#parseRolesAtCompanyDuringTimeframe(rolesAtCompanyDuringTimeframe);

    if (!canParseDateString(startDate)) {
      throw new Error("start date doesn't look right");
    }

    if (endDate != null && !canParseDateString(endDate)) {
      throw new Error("end date doesn't look right");
    }

    const { roles, companyDescriptor } = this.#parseRolesAtCompany(
      rolesAtCompany
    );

    this.#processNewRelationshipFact({
      personDescriptor,
      roles,
      companyDescriptor,
      startDate,
      endDate,
      sourceDescriptors,
    });
  }

  build() {
    const companies = cloneDeep(this.data.companies);
    const people = cloneDeep(this.data.people);
    const relationships = cloneDeep(this.data.relationships);

    const companiesById = keyBy(companies, "id");
    const peopleById = keyBy(people, "id");
    const relationshipsByCompanyId = groupBy(relationships, "company.id");
    const relationshipsByPersonId = groupBy(relationships, "person.id");

    companies.forEach((company) => {
      company.relationships = relationshipsByCompanyId[company.id] ?? [];
    });

    people.forEach((person) => {
      person.relationships = relationshipsByPersonId[person.id] ?? [];
    });

    relationships.forEach((relationship) => {
      relationship.company = isPlainObject(relationship.company)
        ? relationship.company
        : companiesById[relationship.company];
      relationship.person = isPlainObject(relationship.person)
        ? relationship.person
        : peopleById[relationship.person];
      relationship.dateRange = {
        start: parseDateString(relationship.dateRange.start),
        end:
          relationship.dateRange.end != null
            ? parseDateString(relationship.dateRange.end)
            : new Date(),
      };
    });

    return { companies, people, relationships };
  }

  #findProcessorFor(fact) {
    for (const [regex, processorName] of this.constructor.PROCESSORS) {
      const match = fact.match(regex);

      if (match != null) {
        return { processorName, match };
      }
    }

    return null;
  }

  #parseSources(rawSources) {
    return rawSources == null ? [] : rawSources.split(/,[ ]+/);
  }

  #parseRolesAtCompanyDuringTimeframe(rolesAtCompanyDuringTimeframe) {
    let startDate, endDate, rolesAtCompany;

    const match1 = rolesAtCompanyDuringTimeframe.match(
      / (?:from (?<startDate1>.+?) to (?<endDate1>.+?)|between (?<startDate2>.+?) and (?<endDate2>.+?)|since (?<startDate3>.+?))$/
    );

    if (match1 == null) {
      // "in" is often read too early ("actor in ...") so parse this separately
      const match2 = rolesAtCompanyDuringTimeframe.match(
        / in (?<startDate>.+?)$/
      );

      if (match2 == null) {
        throw new Error("Could not parse roles + company + timeframe");
      }

      return {
        startDate: match2.groups.startDate,
        endDate: null,
        rolesAtCompany: rolesAtCompanyDuringTimeframe
          .slice(0, match2.index)
          .trim(),
      };
    } else {
      return {
        startDate:
          match1.groups.startDate1 ??
          match1.groups.startDate2 ??
          match1.groups.startDate3 ??
          match1.groups.startDate4,
        endDate: match1.groups.endDate1 ?? match1.groups.endDate2,
        rolesAtCompany: rolesAtCompanyDuringTimeframe
          .slice(0, match1.index)
          .trim(),
      };
    }
  }

  #parseRolesAtCompany(rolesAtCompany) {
    const match = rolesAtCompany.match(
      /^(?<roles>.+? (?:for|of|on|at|with|within|in)) (?:the )?(?<companyDescriptor>[A-Z].+)$/
    );

    if (match == null) {
      throw new Error("Could not parse roles + company");
    }

    const companyDescriptor = match.groups.companyDescriptor;
    const roles = match.groups.roles
      .replace(/, and /g, ", ")
      .replace(/ and /g, ", ")
      .split(/ |(,)/)
      .filter((word) => !isEmpty(word))
      .filter(
        (word) => !/^(?:for|of|on|at|with|within|in|the|a|an)$/.test(word)
      )
      .join(" ")
      .split(" , ");

    return { roles, companyDescriptor };
  }

  #processNewRelationshipFact({
    personDescriptor,
    companyDescriptor,
    roles,
    startDate,
    endDate = startDate,
    sourceDescriptors,
  }) {
    const person = this.#findObjectByOrThrow(personDescriptor, {
      collection: this.data.people,
      type: "person",
    });
    const company = this.#findObjectByOrThrow(companyDescriptor, {
      collection: this.data.companies,
      type: "company",
    });
    const sources = sourceDescriptors.map((sourceDescriptor) => {
      return this.#findObjectByOrThrow(sourceDescriptor, {
        collection: this.data.sources,
        type: "source",
      });
    });

    this.data.relationships.push({
      company: company,
      person: person,
      roles: roles,
      dateRange: {
        start: parseDateString(startDate),
        end: endDate == null ? null : parseDateString(endDate),
      },
    });
  }

  #findObjectByOrThrow(query, { collection = "any", type = "object" } = {}) {
    const object = this.#findObjectBy(query, { collection });

    if (object != null) {
      return object;
    } else {
      throw new Error(`Could not find ${type} by id, name, or alias: ${query}`);
    }
  }

  #findObjectBy(query, { collection = "any" } = {}) {
    const cleanedQuery = query.replace(/^[Tt]he /, "");
    const collections =
      collection === "any"
        ? [this.data.companies, this.data.people]
        : [collection];

    const foundObjects = collections.flatMap((collection) => {
      return collection.filter((object) => {
        return (
          object.id === cleanedQuery ||
          object.name === cleanedQuery ||
          object.name === `The ${cleanedQuery}` ||
          object.aliases.indexOf(cleanedQuery) !== -1 ||
          object.aliases.indexOf(`The ${cleanedQuery}`) !== -1
        );
      });
    });

    if (foundObjects.length > 1) {
      throw new Error(
        `More than one object found matching id, name, or alias: ${query}. ` +
          `Please be more exact.`
      );
    } else {
      return foundObjects[0];
    }
  }

  #generateIdForNewObjectIn(collection, name) {
    const idWithoutSuffix = kebabCase(name);
    let suffix = 0;
    let id;

    while (true) {
      id = suffix > 0 ? `${idWithoutSuffix}-${suffix}` : idWithoutSuffix;

      if (collection.some((object) => object.id === id)) {
        suffix++;
      } else {
        break;
      }
    }

    return id;
  }
}

export default function buildModel(factsString) {
  const builder = new ModelBuilder();
  const facts = factsString
    .trim()
    .split(/\n+/)
    .filter((line) => line !== "" && !/^#/.test(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\b([A-Z][a-z]+) ((?:[A-Z]\.)+)\b/g, "$1#$2")
    .replace(/\b(Mr.) ([A-Z][a-z]+)\b/g, "$1#$2")
    .match(/"?[A-Z].+?\.(?:(?= "?[A-Z])|$)/g)
    .map((fact) => {
      return fact.replace(/(.+?)#(.+?)/g, "$1 $2");
    });

  facts.forEach((fact) => {
    builder.processFact(fact.trim());
  });

  return builder.build();
}
