import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
import crypto from "crypto";

function generateObjectIdFromString(str) {
    const hash = crypto.createHash("md5").update(str).digest("hex");
    return hash.slice(0, 24);
}

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in reviewsDAO: ${e}`,
            );
        }
    }

    static async addReview(movieId, user, review, date) {
        try {
            console.log("movieId:", movieId);
            console.log("user:", user);
            console.log("review:", review);
            console.log("date:", date);
    
            const validUserId = generateObjectIdFromString(user._id);
    
            const reviewDoc = {
                name: user.name,
                user_id: new ObjectId(validUserId),
                date: date,
                review: review,
                movie_id: new ObjectId(movieId),
            };
    
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
        }
    }                                                                                                                                                                                                                          

    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: new ObjectId(userId), _id: new ObjectId(reviewId) },
                { $set: { review: review, date: date } },
            );
    
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
                user_id: new ObjectId(userId),
            });
    
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }
}                                                                                                                                                                                                                                                  