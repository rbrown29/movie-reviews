import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;


let movies;
export default class MoviesDAO {
static async injectDB(conn) {
    if (movies) {
        return;
    }
    try {
        movies = await conn.db(process.env.MFLIX_NS).collection("movies");
    } catch (e) {
        console.error(
            `Unable to establish a collection handle in moviesDAO: ${e}`,
        );
    }
}
static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
} = {}) {
    let query
    if (filters) {
        if ("title" in filters) {
            query = { $text: { $search: filters["title"] } }
        } else if ("rated" in filters) {
            query = { "rated": { $eq: filters["rated"] } }
        }
    } else {
        query = {} // If no filters are provided, set an empty query object
    }

    let cursor

    try {
        cursor = await movies
            .find(query)
            .limit(moviesPerPage)
            .skip(moviesPerPage * page)
    } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        return { moviesList: [], totalNumMovies: 0 }
    }

    // Fetch the movies from the cursor
    const moviesList = await cursor.toArray()

    // Get the total number of movies matching the query
    const totalNumMovies = await movies.countDocuments(query)

    return { moviesList, totalNumMovies }
}
static async getRatings () {
    let ratings = []
    try {
        ratings = await movies.distinct("rated")
        return ratings
    } catch (e) {
        console.error(`Unable to get ratings, ${e}`)
        return ratings
    }
}
static async getMovieByID(id) {
    try {
        return await movies.aggregate([
            { 
                $match: {
                     _id: new ObjectId(id) 
                } },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movie_id",
                    as: "reviews",
                },
            },
        ]).next()
    } catch (e) {
        console.error(`Something went wrong in getMovieByID: ${e}`)
        throw e

    }
}
}







