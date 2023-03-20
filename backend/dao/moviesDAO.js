let movies

export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return
        }
        try {
            movies = await conn.db(process.env.MFLIX_NS).collection("movies")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in moviesDAO: ${e}`,
            )
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
                query = { "rated": { $eq: [filters["rated"]] } }
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
        }

    }
}