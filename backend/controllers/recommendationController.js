const recommendationService = require("../services/recommendationService");
const { sendSuccess } = require("../utils/response");

const getRecommendations = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const books = await recommendationService.getRecommendations(req.user._id, limit);
    return sendSuccess(res, "Recommendations generated successfully", books);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
