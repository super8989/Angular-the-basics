import { Recipe } from './recipe.model';

export class RecipeService {
  // can't access this directly from outside
  private recipes: Recipe[] = [
    new Recipe(
      'Lasagna',
      'Tomato sauce lasagna with potato chunks',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872'
    ),
    new Recipe(
      'Pasta',
      'Fettucini pasta with alfredo sauce',
      'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/9/26/0/FNK_Tuscan-Chicken-Skillet_H2_s4x3.jpg.rend.hgtvcom.826.620.suffix/1537973085542.jpeg'
    ),
  ];

  // able to get the copy of recipes array from outside
  getRecipes() {
    return this.recipes.slice();
  }
}
