import { Effects } from "@/backend/Effects";
import { IngredientAmount, Substitute } from "@/backend/Substitute";


describe("Substitute class", () => {
  const baseAmount: IngredientAmount = { ingredient: "butter", quantity: 1, unit: "cup" };
  const substitution: IngredientAmount[] = [{ ingredient: "coconut oil", quantity: 1, unit: "cup" }];
  const effects: Effects = { texture: "slightly denser" };
  const recipeTypes = ["cake", "cookie"];
  const tags = ["vegan", "gluten free"];
  const confidence = 0.85;
  const instructions = "Melt before use";

  const sub = new Substitute(
    "Coconut Oil",
    baseAmount,
    substitution,
    tags,
    effects,
    confidence,
    recipeTypes,
    instructions
  );

  it("should construct a Substitute object correctly", () => {
    expect(sub).toBeInstanceOf(Substitute);
    expect(sub.name).toBe("Coconut Oil");
    expect(sub.baseAmount).toEqual(baseAmount);
    expect(sub.substitution).toEqual(substitution);
    expect(sub.tags).toEqual(tags);
    expect(sub.effects).toEqual(effects);
    expect(sub.confidence).toBe(confidence);
    expect(sub.recipeTypes).toEqual(recipeTypes);
    expect(sub.instructions).toBe(instructions);
  });

  it("should indicate supported recipe types", () => {
    recipeTypes.forEach((type) => {
      expect(sub.recipeTypes.includes(type)).toBe(true);
    });
  });

  it("should indicate unsupported recipe types", () => {
    const unsupported = ["bread", "waffles", "other"];
    unsupported.forEach((type) => {
      expect(sub.recipeTypes.includes(type)).toBe(false);
    });
  });

  it("should allow optional instructions to be undefined", () => {
    const subNoInstructions = new Substitute(
      "Butter Substitute",
      baseAmount,
      substitution,
      tags,
      effects,
      confidence,
      recipeTypes
    );
    expect(subNoInstructions.instructions).toBeUndefined();
  });
});
