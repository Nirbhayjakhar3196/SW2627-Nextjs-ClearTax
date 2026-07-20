export async function useFetch(url) {
  const res = await fetch(url);
  return res.json();
}
