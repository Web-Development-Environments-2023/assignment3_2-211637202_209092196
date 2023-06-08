const axios = require('axios');
const api_domain = 'https://api.spoonacular.com/recipes';

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */

/**
 * return all the recipe information
 */
async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

/**
 * return the recipe information (just the information needed for)
 */
async function getRecipeDetails(recipe_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
  };
}

/**
 * return the recipe informations (with ingredients and process ...)
 */
async function getAllInformations(recipe_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  let {
    id,
    title,
    readyInMinutes,
    image,
    aggregateLikes,
    vegan,
    vegetarian,
    glutenFree,
    extendedIngredients,
    analyzedInstructions,
    servings,
  } = recipe_info.data;

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    extendedIngredients: extendedIngredients,
    analyzedInstructions: analyzedInstructions,
    servings: servings,
  };
}

/**
 * return the recipes giving a query and all details needed below
 */
async function searchRecipes(query, number, cuisine, diet, intolerance, sort) {
  const response = await axios.get(`${api_domain}/complexSearch`, {
    params: {
      query: query,
      number: number,
      cuisine: cuisine,
      diet: diet,
      intolerances: intolerance,
      sort: sort,
      apiKey: process.env.spooncular_apiKey,
    },
  });

  const recipeIds = response.data.results.map((recipe) => recipe.id);
  const searchResults = await Promise.all(recipeIds.map(getRecipeDetailsForSeach));

  return searchResults;
}

/**
 * Return all details for the recipes returned from the search function
 */
async function getRecipeDetailsForSeach(recipe_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, analyzedInstructions } =
    recipe_info.data;

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    analyzedInstructions: analyzedInstructions,
  };
}

/**
 * return all information of the recipes in recipeIDs array
 */
async function getRecipesPreview(recipeIds) {
  try {
    const recipePreviews = [];

    for (const recipeId of recipeIds) {
      const recipeDetails = await getRecipeDetails(recipeId);
      recipePreviews.push(recipeDetails);
    }

    return recipePreviews;
  } catch (error) {
    throw error;
  }
}

/**
 * return 3 random recipes with the specific details
 */
async function getRandomRecipes() {
  const response = await axios.get(`${api_domain}/random`, {
    params: {
      number: 3,
      apiKey: process.env.spooncular_apiKey,
    },
  });
  // Extract specific details from the response
  const recipes = response.data.recipes.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      readyInMinutes: recipe.readyInMinutes,
      image: recipe.image,
      popularity: recipe.aggregateLikes,
      vegan: recipe.vegan,
      vegetarian: recipe.vegetarian,
      glutenFree: recipe.glutenFree,
    };
  });
  return recipes;
}

/**
 * return the instructions of the recipe giving the recipe id (bonus)
 */
async function getInstructions(recipe_id) {
  const response = await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
    params: {
      stepBreakdown: true,
      apiKey: process.env.spooncular_apiKey,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to retrieve analyzed instructions');
  }

  const instructions = response.data;

  if (instructions.length === 0) {
    throw new Error('No instructions found for the provided recipe ID');
  }

  return instructions[0].steps;
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomRecipes = getRandomRecipes;
exports.getAllInformations = getAllInformations;
exports.searchRecipes = searchRecipes;
exports.getInstructions = getInstructions;
