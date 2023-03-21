import express from 'express';
import MoviesController from './movies.controller.js';
import ReviewsController from './reviews.controller.js';
const router = express.Router();

router.route('/').get(MoviesController.apiGetMovies) // GET /api/v1/movies

router
    .route('/review')
    .post(ReviewsController.apiPostReview) // POST /api/v1/movies/review
    .put(ReviewsController.apiUpdateReview) // PUT /api/v1/movies/review
    .delete(ReviewsController.apiDeleteReview); // DELETE /api/v1/movies/review



export default router;