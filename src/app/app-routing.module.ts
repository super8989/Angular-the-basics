import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => {
        console.log(m);
        return m.RecipesModule;
      }),
  },

  // Moved to recipes-routing.module.ts
  // { path: 'recipes', component: RecipesComponent, ... },

  // { path: 'shopping-list', component: ShoppingListComponent },

  // { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
