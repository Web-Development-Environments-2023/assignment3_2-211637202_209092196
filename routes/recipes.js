var express = require('express');
var router = express.Router();
const recipes_utils = require('./utils/recipes_utils');

router.get('/', (req, res) => res.send('im here'));

/**
 * This path will get random 3 recipes from the external api
 */
router.get('/random', async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandomRecipes();
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path will get all informations for a specific recipe (informations as needed in the assignment )
 */
router.get('/allInformations/:recipeId', async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getAllInformations(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path will return recipes giving a query and number of recipes to return
 */
router.get('/search/:query/:number', async (req, res, next) => {
  try {
    const { query } = req.params;
    let { number } = req.params;
    const { cuisine, diet, intolerances, sort } = req.query;

    // In client check if this two lines should be deleted
    if (number === '{number}') {
      number = 5;
    }

    // Check if 'number' is not 5, 10, or 15
    if (![5, 10, 15].includes(Number(number))) {
      // Return an error message if 'number' is not 5, 10, or 15
      res.status(400).send('Invalid value for number. Must be one of: 5, 10, 15');
      return;
    }

    // Perform the recipe search using the provided query, number, cuisine, diet, intolerances, and sort parameters
    const searchResults = await recipes_utils.searchRecipes(query, number, cuisine, diet, intolerances, sort);

    if (searchResults.length === 0) {
      // No recipes found for the given query
      res.status(204);
    } else {
      // Return the search results as the response
      res.status(200).send(searchResults);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path will return instructions for the recipe giving a recipe id (bonus)
 */
router.get('/getInstructions/:recipeId', async (req, res, next) => {
  try {
    const instructions = await recipes_utils.getInstructions(req.params.recipeId);
    res.send(instructions);
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
