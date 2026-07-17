export function getAuthUrlParams(url: string) {
  const params = new URLSearchParams();
  const [, query = ''] = url.split('?');
  const [queryString = '', hashString = ''] = query.split('#');
  const directHashString = url.includes('#') ? url.split('#')[1] : '';

  for (const chunk of [queryString, hashString, directHashString]) {
    if (!chunk) {
      continue;
    }

    new URLSearchParams(chunk).forEach((value, key) => {
      params.set(key, value);
    });
  }

  return params;
}
