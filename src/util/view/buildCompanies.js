import { min, uniq, sortBy, sum } from "lodash";

import Color from "../Color";
import emsToPixels from "../emsToPixels";

function buildCompaniesWithRelationships(companies, relationships) {
  return companies.reduce((companies, company) => {
    const companyRelationships = relationships.filter(
      (relationship) => relationship.company === company.id
    );

    if (companyRelationships.length > 0) {
      return [
        ...companies,
        {
          ...company,
          relationships: sortBy(companyRelationships, (relationship) =>
            relationship.dateRange.start.getTime()
          ),
        },
      ];
    } else {
      return companies;
    }
  }, []);
}

function buildSortedCompaniesWithRelationships(companiesWithRelationships) {
  return sortBy(companiesWithRelationships, (company) =>
    min(
      company.relationships.map((relationship) =>
        relationship.dateRange.start.getTime()
      )
    )
  );
}

function buildPlayerView(
  relationship,
  relationshipIndex,
  companyView,
  people,
  playerViewsSoFar,
  mapTo
) {
  const playerPaddingBottom = emsToPixels(1.25, companyView.name.fontSize);
  const lastPlayerView =
    playerViewsSoFar.length > 0
      ? playerViewsSoFar[playerViewsSoFar.length - 1]
      : null;
  const person = people.find((person) => person.id === relationship.player);
  if (person == null) {
    throw new Error(`Could not find person by ${relationship.player}`);
  }
  const playerView = {
    id: relationship.player,
    name: {},
    roles: {},
    marker: {},
    color: person.color,
    model: relationship,
  };

  playerView.name.y =
    companyView.name.lineHeight +
    companyView.name.marginBottom +
    (lastPlayerView != null
      ? (lastPlayerView.height + playerPaddingBottom) * relationshipIndex
      : 0);
  playerView.name.label = person.name;
  playerView.name.fontSize = emsToPixels(1);
  playerView.name.lineHeight = emsToPixels(1.2, {
    relativeTo: playerView.name.fontSize,
  });

  playerView.roles.y = playerView.name.y + playerView.name.lineHeight;
  playerView.roles.fontSize = emsToPixels(0.8);
  playerView.roles.label = relationship.roles.join(", ");
  playerView.roles.lineHeight = emsToPixels(1.2, {
    relativeTo: playerView.roles.fontSize,
  });

  playerView.marker.x = mapTo.x(relationship.dateRange.start);
  playerView.marker.y =
    playerView.roles.y - (playerView.roles.y - playerView.name.y) / 2;
  playerView.marker.radius = 8;

  playerView.name.x = playerView.marker.x - playerView.marker.radius - 15;
  playerView.roles.x = playerView.marker.x - playerView.marker.radius - 15;

  playerView.height = playerView.name.lineHeight + playerView.roles.lineHeight;

  return [...playerViewsSoFar, playerView];
}

function buildCompanyView(companyModel, companyIndex, people, mapTo) {
  const companyView = {
    id: companyModel.id,
    index: companyIndex,
    name: {},
    marginBottom: emsToPixels(4),
    mapToY(y) {
      return mapTo.y(y) + (this.height + this.marginBottom) * this.index;
    },
  };

  companyView.name.label = companyModel.name;
  companyView.name.fontSize = emsToPixels(1.6);
  companyView.name.lineHeight = companyView.name.fontSize;
  companyView.name.marginBottom = emsToPixels(0.5, {
    relativeTo: companyView.name.fontSize,
  });

  companyView.players = companyModel.relationships.reduce(
    (playerViewsSoFar, relationship, relationshipIndex) => {
      return buildPlayerView(
        relationship,
        relationshipIndex,
        companyView,
        people,
        playerViewsSoFar,
        mapTo
      );
    },
    []
  );

  const markerXs = companyView.players.map((playerView) => playerView.marker.x);
  companyView.name.x = sum(markerXs) / markerXs.length;

  const lastPlayerView =
    companyView.players.length > 0
      ? companyView.players[companyView.players.length - 1]
      : null;
  // NOTE: This isn't totally accurate but it's good enough for now
  companyView.height =
    lastPlayerView != null
      ? lastPlayerView.roles.y + lastPlayerView.roles.lineHeight
      : 0;

  // This is very imperative but we can't assign this until we know the height.
  // And we can't know the height until we have all the players
  companyView.name.y = companyView.mapToY(0);
  companyView.players.forEach((player) => {
    player.marker.y = companyView.mapToY(player.marker.y);
    player.name.y = companyView.mapToY(player.name.y);
    player.roles.y = companyView.mapToY(player.roles.y);
  });

  return companyView;
}

export default function buildCompanies(model, mapTo) {
  const companiesWithRelationships = buildCompaniesWithRelationships(
    model.companies,
    model.relationships
  );
  const sortedCompaniesWithRelationships = buildSortedCompaniesWithRelationships(
    companiesWithRelationships
  );
  const peopleIds = uniq(
    sortedCompaniesWithRelationships.flatMap((companyWithRelationships) =>
      companyWithRelationships.relationships.map(
        (relationship) => relationship.player
      )
    )
  );
  const colorHueMultiple = 360 / peopleIds.length;
  const peopleWithRelationships = model.people.reduce(
    (people, person, personIndex) => {
      if (peopleIds.indexOf(person.id) !== -1) {
        const color = new Color({
          h: colorHueMultiple * personIndex,
          c: 30,
          l: 80,
        });
        return [...people, { ...person, color }];
      } else {
        return people;
      }
    },
    []
  );

  return sortedCompaniesWithRelationships.map((company, companyIndex) =>
    buildCompanyView(company, companyIndex, peopleWithRelationships, mapTo)
  );
}
