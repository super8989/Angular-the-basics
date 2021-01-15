import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map } from 'rxjs/operators';

// Optional way to provide service to the root (instead of adding in app.module)
@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();

    this.http
      .put(
        'https://angular-recipe-book-e8016-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    this.http
      .get<Recipe[]>(
        'https://angular-recipe-book-e8016-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipes) => {
          console.log(recipes);
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        })
      )
      .subscribe((recipes) => {
        console.log(recipes);
        this.recipesService.setRecipes(recipes);
      });
  }
}
