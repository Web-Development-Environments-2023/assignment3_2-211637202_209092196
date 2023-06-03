var express = require('express');
var router = express.Router();
const recipes_utils = require('./utils/recipes_utils');

router.get('/', (req, res) => res.send('im here'));

// This function will get random 3 recipes from the external api
router.get('/random', async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandomRecipes();
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get('/:recipeId', async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
