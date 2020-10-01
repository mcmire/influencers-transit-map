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
      end: parseDateString(relationship.dateRange.end),
    };
  });

  return { companies, people, relationships };
}

class ModelBuilder {
  static PROCESSORS = [
    [/^(.+) is a source with URL "(.+?)"\.$/, "processNewSourceFact"],
    [/^(?:The )?(.+) is an? (?:organization|show)\.$/, "processNewCompanyFact"],
    [
      /^When displaying (?:[Tt]he )?(.+), use "(.+)"\.$/,
      "processCompanyDisplayNameFact",
    ],
    [/^"(.+)" is short for (.+)\.$/, "processAliasFact"],
    [/^(.+) is a person\.$/, "processNewPersonFact"],
    [
      /^(.+) was (.+) (?:in|on|between) (?:some time in )?(.+?)(?: and (?:some time in )?(.+?))?(?: \(sources?: (.+)\))?\.$/,
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
    const result = this.#findProcessorFor(fact);

    if (result != null) {
      this[result.processorName](fact, result.match);
    } else {
      throw new Error(`Don't know how to process fact: ${fact}`);
    }
  }

  processNewSourceFact(fact, match) {
    this.data.sources.push({ id: match[1], url: match[2], aliases: [] });
  }

  processNewCompanyFact(fact, match) {
    const id = this.#generateIdForNewObjectIn(this.data.companies, match[1]);

    this.data.companies.push({
      id: id,
      name: match[1],
      displayName: match[1],
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

  processNewRelationshipFact(fact, match1) {
    const personDescriptor = match1[1];
    const startDate = match1[3];
    const endDate = match1[4] ?? match1[3];
    const sourceDescriptors = match1[5] == null ? [] : match1[5].split(/,[ ]+/);

    if (/\band\b/.test(match1[2])) {
      const match2 = match1[2].match(
        /\b(?:an? )?(.+?) (?:(?:for|of|on) )?and (?:an? )?(.+?) (?:for|of|on) (?:the )?(.+)/
      );

      if (match2 != null) {
        const roles = [match2[1], match2[2]];
        const companyDescriptor = match2[3];

        this.#processNewRelationshipFact({
          personDescriptor: personDescriptor,
          roles: roles,
          companyDescriptor: companyDescriptor,
          startDate: startDate,
          endDate: endDate,
          sourceDescriptors: sourceDescriptors,
        });
      } else {
        return false;
      }
    } else {
      const match2 = match1[2].match(
        /\b(?:an? )?(.+?) (?:for|of|on) (?:the )?(.+)/
      );

      if (match2 != null) {
        const roles = [match2[1]];
        const companyDescriptor = match2[2];

        this.#processNewRelationshipFact({
          personDescriptor: personDescriptor,
          roles: roles,
          companyDescriptor: companyDescriptor,
          startDate: startDate,
          endDate: endDate,
          sourceDescriptors: sourceDescriptors,
        });
      } else {
        return false;
      }
    }
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
        end: parseDateString(endDate),
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
    const collections =
      collection === "any"
        ? [this.data.companies, this.data.people]
        : [collection];

    const foundObjects = collections.flatMap((collection) => {
      return collection.filter((object) => {
        return (
          object.id === query ||
          object.name === query ||
          object.aliases.indexOf(query) !== -1
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
    .match(/.+?\.(?: |$)/g);

  facts.forEach((fact) => {
    console.debug(`Fact: ${fact}`);
    builder.processFact(fact.trim());
  });

  console.log("final data", builder.data);

  return oldBuildModel(builder.data);
}
