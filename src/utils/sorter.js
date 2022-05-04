export default function sortData(arr, orderDirection, label) {
  if (orderDirection === "asc") {
    return arr.sort((a, b) => {
      if (!a[label]) a = a.resume;
      if (!b[label]) b = b.resume;
      return a[label] > b[label] ? 1 : b[label] > a[label] ? -1 : 0;
    });
  }
  return arr.sort((a, b) => {
    if (!a[label]) a = a.resume;
    if (!b[label]) b = b.resume;
    return a[label] < b[label] ? 1 : b[label] < a[label] ? -1 : 0;
  });
}
