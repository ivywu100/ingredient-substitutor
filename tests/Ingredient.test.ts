import { Effects } from "@/backend/Effects";
import { Ingredient } from "@/backend/Ingredient";
import { IngredientAmount, Substitute } from "@/backend/Substitute";


describe("Ingredient class", () => {
  const baseAmount: IngredientAmount = { ingredient: "butter", quantity: 1, unit: "cup" };
  const substitution: IngredientAmount[] = [{ ingredient: "coconut oil", quantity: 1, unit: "cup" }];
  const effects: Effects = { texture: "slightly denser" };

  const subCakeCookie = new Substitute(
    "Coconut Oil",
    baseAmount,
    substitution,
    ["vegan"],
    effects,
    0.85,
    ["cake", "cookie"],
    "Melt before use"
  );

  const subBread = new Substitute(
    "Margarine",
    baseAmount,
    substitution,
    ["vegan"],
    effects,
    0.8,
    ["bread"],
    "Use at room temperature"
  );

  const ingredient = new Ingredient("Butter", [subCakeCookie, subBread]);

  it("should normalize the ingredient name", () => {
    expect(ingredient.name).toBe("butter");
  });

  it("should store all substitutes", () => {
    expect(ingredient.substitutes).toHaveLength(2);
    expect(ingredient.substitutes[0].name).toBe("Coconut Oil");
    expect(ingredient.substitutes[1].name).toBe("Margarine");
  });

  describe("supportsRecipe", () => {
    it("should return true if any substitute supports the recipe type", () => {
      expect(ingredient.supportsRecipe("cake")).toBe(true);
      expect(ingredient.supportsRecipe("cookie")).toBe(true);
      expect(ingredient.supportsRecipe("bread")).toBe(true);
    });

    it("should return false if no substitute supports the recipe type", () => {
      expect(ingredient.supportsRecipe("pancakes")).toBe(false);
      expect(ingredient.supportsRecipe("waffles")).toBe(false);
    });
  });

  describe("getSubstitutesForRecipe", () => {
    it("should return only substitutes that support the given recipe type", () => {
      const cakeSubs = ingredient.getSubstitutesForRecipe("cake");
      expect(cakeSubs).toHaveLength(1);
      expect(cakeSubs[0].name).toBe("Coconut Oil");

      const breadSubs = ingredient.getSubstitutesForRecipe("bread");
      expect(breadSubs).toHaveLength(1);
      expect(breadSubs[0].name).toBe("Margarine");
    });

    it("should return an empty array if no substitutes support the recipe type", () => {
      const waffleSubs = ingredient.getSubstitutesForRecipe("waffles");
      expect(waffleSubs).toHaveLength(0);
    });
  });
});
