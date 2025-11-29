export async function fetchDummyData(file) {
  try {
    const res = await fetch(`./data/${file}`);
    if (!res.ok) {
      console.error(`Failed to fetch ${file}: ${res.status}`);
      return [];
    }
    const data = await res.json();
    console.log(`Successfully loaded ${file}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${file}:`, error);
    return [];
  }
}
