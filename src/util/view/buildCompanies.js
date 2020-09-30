import { min, keyBy, groupBy, reduce, uniq, sortBy, sum } from "lodash";

import Color from "../Color";
import emsToPixels from "../emsToPixels";

function sortAndFilterCompanies(companies) {
  return sortBy(
    companies.map((company) => {
      return {
        ...company,
        relationships: sortBy(company.relationships, (relationship) => {
          return relationship.dateRange.start.getTime();
        }).map((relationship, relationshipIndex) => {
          return { ...relationship, index: relationshipIndex };
        }),
      };
    }),
    (company) => {
      return min(
        company.relationships.map((relationship) =>
          relationship.dateRange.start.getTime()
        )
      );
    }
  )
    .filter((company) => {
      return company.relationships.length > 0;
    })
    .map((company, companyIndex) => {
      return { ...company, index: companyIndex };
    });
}

function buildPersonViews(people) {
  const peopleWithRelationships = people.filter((person) => {
    return person.relationships.length > 0;
  });
  const colorHueMultiple = 360 / peopleWithRelationships.length;
  return peopleWithRelationships.map((person, personIndex) => {
    const color = new Color({
      h: colorHueMultiple * personIndex,
      c: 30,
      l: 80,
    });
    return { ...person, color };
  });
}

function buildPlayerView(
  relationship,
  companyView,
  personView,
  playerViewsSoFar,
  mapTo
) {
  const playerPaddingBottom = emsToPixels(1.25, companyView.name.fontSize);
  const lastPlayerView =
    playerViewsSoFar.length > 0
      ? playerViewsSoFar[playerViewsSoFar.length - 1]
      : null;
  const playerView = {
    id: relationship.person.id,
    name: {},
    roles: {},
    marker: {},
    extension: {},
    model: relationship,
  };

  playerView.name.y =
    companyView.name.lineHeight +
    companyView.name.marginBottom +
    (lastPlayerView != null
      ? (lastPlayerView.height + playerPaddingBottom) * relationship.index
      : 0);
  playerView.name.label = personView.name;
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
  playerView.marker.color = personView.color;

  playerView.extension.x = mapTo.x(relationship.dateRange.end);
  playerView.extension.y = playerView.marker.y;

  playerView.name.x = playerView.marker.x - playerView.marker.radius - 15;
  playerView.roles.x = playerView.marker.x - playerView.marker.radius - 15;

  playerView.height = playerView.name.lineHeight + playerView.roles.lineHeight;

  return [...playerViewsSoFar, playerView];
}

function buildCompanyView(company, personViewsById, mapTo) {
  const companyView = {
    id: company.id,
    index: company.index,
    name: {},
    marginBottom: emsToPixels(4),
    mapToY(y) {
      return mapTo.y(y) + (this.height + this.marginBottom) * this.index;
    },
  };

  companyView.name.label = company.name
    .split(/(\*.+\*)/)
    .filter((str) => str.length > 0)
    .map((part) => {
      const match = part.match(/^\*(.+)\*$/);

      if (match) {
        return `<tspan font-style="italic">${match[1]}</tspan>`;
      } else {
        return `<tspan>${part}</tspan>`;
      }
    })
    .join("");
  companyView.name.fontSize = emsToPixels(1.6);
  companyView.name.lineHeight = companyView.name.fontSize;
  companyView.name.marginBottom = emsToPixels(0.5, {
    relativeTo: companyView.name.fontSize,
  });

  companyView.players = company.relationships.reduce(
    (playerViewsSoFar, relationship) => {
      const personView = personViewsById[relationship.person.id];

      if (personView == null) {
        throw new Error(
          `Can't find person view by "${relationship.person.id}"!`
        );
      }

      return buildPlayerView(
        relationship,
        companyView,
        personView,
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
    player.extension.y = player.marker.y;
    player.name.y = companyView.mapToY(player.name.y);
    player.roles.y = companyView.mapToY(player.roles.y);
  });

  return companyView;
}

export default function buildCompanies(model, mapTo) {
  const sortedCompanies = sortAndFilterCompanies(model.companies);
  const personViews = buildPersonViews(model.people);
  const personViewsById = keyBy(personViews, "id");

  const companyViews = sortedCompanies.map((company) => {
    return buildCompanyView(company, personViewsById, mapTo);
  });

  const playerViewsByPersonId = companyViews.reduce((obj1, companyView) => {
    return reduce(
      companyView.players,
      (obj2, playerView) => {
        const personId = playerView.id;
        if (personId in obj2) {
          return {
            ...obj2,
            [personId]: [...obj2[personId], playerView],
          };
        } else {
          return { ...obj2, [personId]: [playerView] };
        }
      },
      obj1
    );
  }, {});

  const peopleViews = personViews.map((personView) => {
    const playerViews = playerViewsByPersonId[personView.id];

    if (playerViews == null) {
      throw new Error(`Can't find player view by "${personView.id}"!`);
    }

    const pathColor = playerViews[0].marker.color.lighten(0.15);

    return {
      id: playerViews[0].id,
      career: { companyTenures: playerViews, pathColor: pathColor },
    };
  });

  return { companyViews, peopleViews };
}
