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
  const playerPaddingBottom = emsToPixels(1);
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
    lastPlayerView != null
      ? lastPlayerView.name.y + lastPlayerView.height + playerPaddingBottom
      : companyView.mapToY(
          companyView.name.lineHeight + companyView.name.marginBottom
        );
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

function buildCompanyView(company, companyViewsSoFar, personViewsById, mapTo) {
  const lastCompanyView = companyViewsSoFar[companyViewsSoFar.length - 1];
  const companyView = {
    id: company.id,
    index: company.index,
    name: {
      fontSize: emsToPixels(1.6),
    },
    get y() {
      return lastCompanyView != null
        ? lastCompanyView.y + lastCompanyView.height + this.marginBottom
        : mapTo.y(0);
    },
    get marginBottom() {
      return emsToPixels(3, { relativeTo: this.name.fontSize });
    },
    mapToY(y) {
      return this.y + y;
    },
  };

  companyView.name.y = companyView.mapToY(0);
  companyView.name.label = company.displayName
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
  const lastPlayerView = companyView.players[companyView.players.length - 1];
  const markerXs = companyView.players.map((playerView) => playerView.marker.x);
  companyView.height =
    lastPlayerView != null
      ? lastPlayerView.roles.y + lastPlayerView.roles.lineHeight - companyView.y
      : 0;
  companyView.name.x = sum(markerXs) / markerXs.length;

  return companyView;
}

export default function buildCompanies(model, mapTo) {
  const sortedCompanies = sortAndFilterCompanies(model.companies);
  const personViews = buildPersonViews(model.people);
  const personViewsById = keyBy(personViews, "id");

  const companyViews = sortedCompanies.reduce((companyViewsSoFar, company) => {
    return [
      ...companyViewsSoFar,
      buildCompanyView(company, companyViewsSoFar, personViewsById, mapTo),
    ];
  }, []);

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
