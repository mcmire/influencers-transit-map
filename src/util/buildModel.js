import { cloneDeep, groupBy, isPlainObject, kebabCase, keyBy } from "lodash";

import parseDateString from "./parseDateString";

function oldBuildModel(data) {
  const companies = cloneDeep(data.companies);
  const people = cloneDeep(data.people);
  const relationships = cloneDeep(data.relationships);

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
      /^(.+) (?:was|has been) (.+?) (?:between|from) (?:some time in )?(.+?) (?:and|to) (?:some time in )?(.+?)(?: \(sources?: (.+)\))?\.$/,
      "processNewRelationshipFactWithTwoDates",
    ],
    [
      /^(.+) (?:was|has been) (.+?) (in|on|since|from) (?:some time in )?(.+?)(?: \(sources?: (.+)\))?\.$/,
      "processNewRelationshipFactWithOneDate",
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

  processNewRelationshipFactWithOneDate(fact, match) {
    this.#processNewRelationshipFact(fact, [
      null,
      match[1], // person
      match[2], // roles
      match[3], // preposition
      match[4], // start date
      null, // end date
      match[5], // sources
    ]);
  }

  processNewRelationshipFactWithTwoDates(fact, match) {
    this.#processNewRelationshipFact(fact, [
      null,
      match[1], // person
      match[2], // roles
      null, // preposition
      match[3], // start date
      match[4], // end date
      match[5], // sources
    ]);
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

  #processNewRelationshipFact(fact, match1) {
    const personDescriptor = match1[1];
    const startDate = match1[4];
    const endDate = match1[3] === "since" ? null : match1[5] ?? match1[4];
    const sourceDescriptors = match1[6] == null ? [] : match1[6].split(/,[ ]+/);
    let companyDescriptor;
    let rawRoles;

    const match2 = match1[2].match(/^(.+?) (?:the )?([A-Z].+)$/);

    if (match2 != null) {
      companyDescriptor = match2[2];

      if (/\b(?:, )?and\b/.test(match2[1])) {
        const match3 = match2[1].match(/^(.+?) (?:for|of|on|at|within)$/);

        if (match3 != null) {
          rawRoles = match3[1].split(/\b(?:, )?and\b/);
        } else {
          debugger;
          return false;
        }
      } else {
        rawRoles = [match2[1]];
      }
    } else {
      debugger;
      return false;
    }

    const roles = rawRoles.map((clause) => {
      return clause
        .replace(/\b(?:an? |the )?\b/g, "")
        .replace(/(?: (?:for|of|on|at|within))\b/, "")
        .trim();
    });

    this.#_processNewRelationshipFact({
      personDescriptor: personDescriptor,
      roles: roles,
      companyDescriptor: companyDescriptor,
      startDate: startDate,
      endDate: endDate,
      sourceDescriptors: sourceDescriptors,
    });
  }

  #_processNewRelationshipFact({
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

  return oldBuildModel(builder.data);
}
