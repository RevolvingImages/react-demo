const BASE_URL = "https://api.themoviedb.org/3";

module.exports = async function (context, req) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      context.res = { status: 500, body: { error: "Server misconfiguration" } };
      return;
    }
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${apiKey}`);
    if (!response.ok) {
      context.res = { status: response.status, body: { error: "Upstream TMDB error" } };
      return;
    }
    const data = await response.json();
    context.res = { body: data.results };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: "Internal server error" } };
  }
};
