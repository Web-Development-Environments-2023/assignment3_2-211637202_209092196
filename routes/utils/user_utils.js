const DButils = require('./DButils');

async function markAsFavorite(user_id, recipe_id) {
  await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}','${recipe_id}')`);
}

async function getFavoriteRecipes(user_id) {
  const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
  return recipes_id;
}

async function markAsVisited(user_id, recipe_id) {
  await DButils.execQuery(
    `INSERT INTO VisitedRecipes (user_id, recipe_id, currposition) VALUES ('${user_id}', '${recipe_id}', CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE currposition = CURRENT_TIMESTAMP`
  );
}

async function getVisitedRecipes(user_id) {
  const recipes_id = await DButils.execQuery(
    `select recipe_id from VisitedRecipes where user_id='${user_id}' ORDER BY currposition DESC LIMIT 3`
  );
  return recipes_id;
}

async function createRecipes(dic) {
  await DButils.execQuery(
    `INSERT INTO Recipes (user_id, title, image, readyInMinutes, popularity, vegetarian, vegan, glutenFree, extendedIngredients, analyzedInstructions, servings) VALUES ('${dic.user_id}', '${dic.title}', '${dic.image}', '${dic.readyInMinutes}', '${dic.popularity}', '${dic.vegetarian}', '${dic.vegan}', '${dic.glutenFree}', '${dic.extendedIngredients}', '${dic.analyzedInstructions}', '${dic.servings}')`
  );
}

async function getMyRecipes(user_id) {
  const recipes = await DButils.execQuery(
    `SELECT title, image, readyInMinutes, popularity, vegetarian, vegan, glutenFree FROM Recipes WHERE user_id = '${user_id}'`
  );
  return recipes;
}

async function getMyRecipesDetailed(user_id, title) {
  const recipe =
    await DButils.execQuery(`SELECT title, image, readyInMinutes, popularity, vegetarian, vegan, glutenFree,
  extendedIngredients, analyzedInstructions, servings FROM Recipes WHERE user_id = '${user_id}' AND title = '${title}'`);
  return recipe;
}

async function getFamilyRecipes(user_id) {
  const recipes = await DButils.execQuery(
    `SELECT title, image, readyInMinutes, popularity, vegetarian, vegan, glutenFree FROM FamilyRecipes WHERE user_id = '${user_id}'`
  );
  return recipes;
}

async function getFamilyRecipesDetailed(user_id, title) {
  const recipe = await DButils.execQuery(
    `SELECT belongTo, whenToMake, title, image, readyInMinutes, popularity, vegetarian, vegan, glutenFree,
    extendedIngredients, analyzedInstructions, servings FROM FamilyRecipes WHERE user_id = '${user_id}' AND title = '${title}'`
  );
  return recipe;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsVisited = markAsVisited;
exports.getVisitedRecipes = getVisitedRecipes;
exports.createRecipes = createRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getMyRecipesDetailed = getMyRecipesDetailed;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getFamilyRecipesDetailed = getFamilyRecipesDetailed;
