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
            console.log(ReviewResponse);
        } catch (e) {
            res.status(500).json({ error: e.message });
            console.log(e.message);
        }
    
}

static async apiUpdateReview(req, res, next) {
    try {
        const reviewId = req.body.review_id;
        const userId = req.body.user_id;
        const review = req.body.review;
        const date = new Date();

        // Validate and convert review_id to ObjectId
        if (!isValidObjectId(reviewId)) {
            res.status(400).json({ error: "Invalid review_id format" });
            return;
        }
        const convertedReviewId = new ObjectId(reviewId);

        // Validate and convert user_id to ObjectId
        if (!isValidObjectId(userId)) {
            res.status(400).json({ error: "Invalid user_id format" });
            return;
        }
        const convertedUserId = new ObjectId(userId);

        const ReviewResponse = await ReviewsDAO.updateReview(
            convertedReviewId,
            convertedUserId,
            review,
            date
        );

        var { error } = ReviewResponse;
        if (error) {
            res.status(400).json({ error });
        }

        if (ReviewResponse.modifiedCount === 0) {
            throw new Error(
                "unable to update review - user may not be original poster",
            );
        }

        res.json({ status: "success" });
        console.log("Review updated successfully");
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

static async apiDeleteReview(req, res, next) {
    try {
        const reviewId = req.body.review_id;
        const userId = req.body.user_id;
        console.log(reviewId);
        const ReviewResponse = await ReviewsDAO.deleteReview(
            reviewId,
            userId,
        );
        res.json({ status: "success" });
        console.log("Review deleted successfully");
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
   
}