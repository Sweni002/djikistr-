export function dijkstra(graph, start) {
  const distances = {};
  const visited = {};
  const previous = {};

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[start] = 0;

  while (true) {
    let closest = null;
    Object.keys(distances).forEach((node) => {
      if (
        !visited[node] &&
        (closest === null || distances[node] < distances[closest])
      ) {
        closest = node;
      }
    });

    if (closest === null) break;
    visited[closest] = true;

    Object.entries(graph[closest]).forEach(([neighbor, weight]) => {
      if (!visited[neighbor]) {
        const newDist = distances[closest] + weight;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = closest;
        }
      }
    });
  }

  return { distances, previous };
}
