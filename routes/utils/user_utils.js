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

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsVisited = markAsVisited;
exports.getVisitedRecipes = getVisitedRecipes;
