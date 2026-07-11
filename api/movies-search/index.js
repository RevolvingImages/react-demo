const BASE_URL = "https://api.themoviedb.org/3";

module.exports = async function (context, req) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const query = req.query.q;
    if (!apiKey) {
      context.res = { status: 500, jsonBody: { error: "Server misconfiguration" } };
      return;
    }
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      context.res = { status: response.status, jsonBody: { error: "Upstream TMDB error" } };
      return;
    }
    const data = await response.json();
    context.res = { jsonBody: data.results };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, jsonBody: { error: "Internal server error" } };
  }
};
