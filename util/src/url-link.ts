export function fixUrl(url: string) {
  return url.trim().replace(/[\s./;-]+/g, '-');
}

export function generateUrl(path: string, id: string, title: string) {
  const url = `/${path}/${id}/${fixUrl(title).toLowerCase()}`;
  return encodeURI(url);
}
