import ReviewsDAO from "../dao/reviewsDAO.js";
import { ObjectId } from "mongodb";

function isValidObjectId(id) {
    return ObjectId.isValid(id);
}

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id;
            const review = req.body.review;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id, 
            };
            const date = new Date();

            // Validate and convert movie_id to ObjectId
            if (!isValidObjectId(movieId)) {
                res.status(400).json({ error: "Invalid movie_id format" });
                return;
            }
            const convertedMovieId = new ObjectId(movieId);

            const ReviewResponse = await ReviewsDAO.addReview(
                convertedMovieId,
                userInfo,
                review,
                date
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    
}

static async apiUpdateReview(req, res, next) {
    try {
        const reviewId = req.body.review_id
        const text = req.body.text
        const date = new Date()

        const ReviewResponse = await ReviewsDAO.updateReview(
            reviewId,
            req.body.user_id,
            text,
            date
        )

        var { error } = ReviewResponse
        if (error) {
            res.status(400).json({ error })
        }

        if (ReviewResponse.modifiedCount === 0) {
            throw new Error(
                "unable to update review - user may not be original poster",
            )
        }

        res.json({ status: "success" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

static async apiDeleteReview(req, res, next) {
    try {
        const reviewId = req.body.query.id
        const userId = req.body.user_id
        console.log(reviewId)
        const ReviewResponse = await ReviewsDAO.deleteReview(
            reviewId,
            userId,
        )
        res.json({ status: "success" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }

}
   
}
console.trace('error');