export default class MoviesController {
    static async apiGetMovies(req,res,next){
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0

        let filters = {} 
        if(req.query.rated){            
            filters.rated = req.query.rated
        } 
        else if(req.query.title){            
            filters.title = req.query.title            
        }
        const MoviesDAO = (await import("../dao/moviesDAO.js")).default;
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters, 
            page, 
            moviesPerPage
        });

        let response ={
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        res.json(response) 
}
 static async apiGetMovieById(req,res,next){
        try{
            let id = req.params.id || {}
            const MoviesDAO = (await import("../dao/moviesDAO.js")).default;
            let movie = await MoviesDAO.getMovieByID(id)
            if(!movie){
                res.status(404).json({error: "Not found"})
                return
            }
            res.json(movie)
        }catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetMovieRatings(req,res,next) {
        try {
            const MoviesDAO = (await import("../dao/moviesDAO.js")).default;
            const propertyTypes = await MoviesDAO.getRatings();
            res.json(propertyTypes);
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}