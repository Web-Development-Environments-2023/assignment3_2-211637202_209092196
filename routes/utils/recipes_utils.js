const axios = require('axios');
const api_domain = 'https://api.spoonacular.com/recipes';

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */

// return all the recipe information
async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

// return the recipe information (just the information needed for)
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

// return all information of the recipes in recipeIDs array
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

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomRecipes = getRandomRecipes;
