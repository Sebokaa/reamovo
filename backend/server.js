require("dotenv").config();

const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");

const app = express();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    console.log("Homepage route hit");
    res.send("Backend is running");
});

async function getMovieDetails(title, year) {

    const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );

    const data = await response.json();
    const movie = data.results?.find(
        (movie) => movie.release_date?.startsWith(String(year))
    );

    return movie || data.results[0] || null;
}

app.post("/recommendations", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            response_format: {
                type: "json_object"
            },
            messages: [
                {
                    role: "system",
                    content: `
                Return ONLY a JSON object.

                The "recommendations" field MUST be an array of exactly 6 objects.

                Each object MUST contain:

                - title
                - year
                - reason

                Example:

                {
                    "recommendations": [
                        {
                            "title": "Get Out",
                            "year": 2017,
                            "reason": "..."
                        },
                        {
                            "title": "Shaun of the Dead",
                            "year": 2004,
                            "reason": "..."
                        }
                    ]
                }

                Make the reason personalized based on the user's prompt.

                Do not give generic reasons like:
                "Because you like horror movies."

                Explain the connection between the recommended movie and the user's preferences.

                Never return plain text.

                Never summarize.

                Never return a string.

                The recommendations field must always be an array.
            `
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const content = response.choices[0].message.content;
        const movies = JSON.parse(content);


        const enrichedRecommendations = await Promise.all(
            movies.recommendations.map(async (movie) => {

                const details = await getMovieDetails(movie.title, movie.year);

                return {
                    id: details?.id || null,
                    title: movie.title,
                    overview: details?.overview || "No overview available",
                    reason: movie.reason,
                    poster: details?.poster_path,
                    backdrop_path: details?.backdrop_path,
                    rating: details?.vote_average,
                    release_date: details?.release_date
                };

            })
        );


        res.json({
            recommendations: enrichedRecommendations
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to generate recommendations"
        });
    }
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});