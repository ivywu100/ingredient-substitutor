import { Effects } from "@/backend/Effects";
import { RecipeType, Ingredient } from "@/backend/Ingredient";
import { IngredientAmount, Substitute } from "@/backend/Substitute";


describe('Ingredient class', () => {
  const baseAmount: IngredientAmount = { ingredient: 'butter', quantity: 1, unit: 'cup' };
  const substitution: IngredientAmount[] = [{ ingredient: 'coconut oil', quantity: 1, unit: 'cup' }];
  const effects: Effects = { texture: 'slightly denser' };

  const sub = new Substitute('coconut oil', baseAmount, substitution, ['vegan'], effects, 0.8, 'Melt before use');

  const recipeTypes: RecipeType[] = ['cake', 'cookie'];
  const ingredient = new Ingredient('Butter', recipeTypes, [sub]);

  it('should normalize the ingredient name', () => {
    expect(ingredient.name).toBe('butter');
  });

  it('should store the recipe types', () => {
    expect(ingredient.recipeTypes).toEqual(recipeTypes);
  });

  it('should store the substitutes', () => {
    expect(ingredient.substitutes).toHaveLength(1);
    expect(ingredient.substitutes[0].name).toBe('coconut oil');
  });

  it('supportsRecipe should return true for supported recipe types', () => {
    expect(ingredient.supportsRecipe('cake')).toBe(true);
    expect(ingredient.supportsRecipe('cookie')).toBe(true);
  });

  it('supportsRecipe should return false for unsupported recipe types', () => {
    expect(ingredient.supportsRecipe('bread')).toBe(false);
    expect(ingredient.supportsRecipe('pancakes')).toBe(false);
  });
});
