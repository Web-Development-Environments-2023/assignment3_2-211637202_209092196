var express = require('express');
var router = express.Router();
const DButils = require('./utils/DButils');
const user_utils = require('./utils/user_utils');
const recipe_utils = require('./utils/recipes_utils');

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery('SELECT user_id FROM users')
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;

    // Check if the recipe ID is valid
    const recipeDetails = await recipe_utils.getRecipeDetails(recipe_id);

    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send('The Recipe successfully saved as favorite');
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the Visited list of the logged-in user
 */
router.post('/visited', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;

    // Check if the recipe ID is valid
    const recipeDetails = await recipe_utils.getRecipeDetails(recipe_id);

    await user_utils.markAsVisited(user_id, recipe_id);
    res.status(200).send('The Recipe successfully saved as visited');
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the last 3 visited recipes that were saved by the logged-in user
 */
router.get('/visited', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    // getVisitedRecipes will return only the last 3 recipes id that the user has recently visited
    const recipes_id = await user_utils.getVisitedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id));
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path will create a new recipe made by the user and save it to the database
 */
router.post('/create', async (req, res, next) => {
  try {
    const {
      title,
      image,
      readyInMinutes,
      popularity,
      vegetarian,
      vegan,
      glutenFree,
      extendedIngredients,
      analyzedInstructions,
      servings,
    } = req.body;

    const recipe = {
      user_id: req.session.user_id,
      title,
      image,
      readyInMinutes,
      popularity,
      vegetarian,
      vegan,
      glutenFree,
      extendedIngredients,
      analyzedInstructions,
      servings,
    };

    await user_utils.createRecipes(recipe);
    res.status(200).send('Recipe created successfully!');
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the recipes made by the user
 */
router.get('/myrecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await user_utils.getMyRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the recipes made by the user with all the details (including the equipment and instructions..)
 */
router.get('/myrecipes/allInformations/:title', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const title = req.params.title;
    const recipes = await user_utils.getMyRecipesDetailed(user_id, title);
    if (recipes.length === 0) {
      res.status(204).send('no recipes found');
    } else {
      res.status(200).send(recipes);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the recipes that the user saved from the beggining as a family recipe
 */
router.get('/familyrecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await user_utils.getFamilyRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the family recipes of a user with all the details (including the equipment and instructions..)
 */
router.get('/familyrecipes/allInformations/:title', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const title = req.params.title;
    const recipes = await user_utils.getFamilyRecipesDetailed(user_id, title);
    if (recipes.length === 0) {
      res.status(204).send('no recipes found');
    } else {
      res.status(200).send(recipes);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path save a recipe in the meal list of the user
 */
router.post('/meal', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsMeal(user_id, recipe_id);
    res.status(200).send('The Recipe successfully saved as visited');
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the recipes saved as in the meal list of a user
 */
router.get('/meal', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getMeals(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id));
    res.status(200).send(recipes_id);
  } catch (error) {
    next(error);
  }
});

/**
 * This path delete a recipe in the meal list of a user
 */
router.delete('/meal', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.deleteMeal(user_id, recipe_id);
    res.status(200).send('The Recipe successfully deletedfrom meal list');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
