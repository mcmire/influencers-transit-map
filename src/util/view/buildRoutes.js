import { map, merge } from "lodash";

export default function buildRoutes(model, companyViews, mapTo) {
  const playerViewsByPlayerId = companyViews.reduce((obj1, companyView) => {
    return companyView.players.reduce((obj2, playerView) => {
      if (playerView.id in obj2) {
        return {
          ...obj2,
          [playerView.id]: [...obj2[playerView.id], playerView],
        };
      } else {
        return { ...obj2, [playerView.id]: [playerView] };
      }
    }, obj1);
  }, {});

  return map(playerViewsByPlayerId, (playerViews, playerId) => {
    const color = playerViews[0].color.lighten(0.15);
    const stops = playerViews.flatMap((playerView) => {
      return [
        {
          x: playerView.marker.x,
          y: playerView.marker.y,
        },
        {
          x: mapTo.x(playerView.model.dateRange.end),
          y: playerView.marker.y,
        },
      ];
    });
    return { id: playerId, color: color, stops: stops };
  });
}
