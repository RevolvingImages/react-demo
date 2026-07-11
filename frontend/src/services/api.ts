export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
}

const BASE_URL = "/api/movies";

export const getPopularMovies = async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/popular`);
    if (!response.ok) throw new Error("Failed to fetch popular movies");

    return response.json();
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to search movies");

    return response.json();
};