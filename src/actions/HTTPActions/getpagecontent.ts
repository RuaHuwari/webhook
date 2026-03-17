export async function getPageContent(url: {payload:string}) {
  try {
    const response = await fetch(url.payload);

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    return {result: html};
  } catch (error) {
    console.error("Error fetching page:", error);
    return {result: `${error}`};
  }
}