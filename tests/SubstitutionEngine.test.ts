import { RecipeType } from "@/backend/Ingredient";
import { Substitute } from "@/backend/Substitute";
import { engine } from "@/backend/SubstitutionEngine";


describe('SubstitutionEngine', () => {
  beforeAll(() => {
    engine.init();
  });

  it('should initialize without errors', () => {
    expect(engine).toBeDefined();
  });

  it('should get an ingredient by name', () => {
    const ingredient = engine.getIngredient('butter');
    expect(ingredient).toBeDefined();
    expect(ingredient?.name).toBe('butter');
  });

  it('should return undefined for unknown ingredients', () => {
    const ingredient = engine.getIngredient('unicorn dust');
    expect(ingredient).toBeUndefined();
  });

  it('should return substitutes for a valid ingredient and recipe type', () => {
    const substitutes = engine.getSubstitutes('butter', ['cake'] as RecipeType[]);
    expect(substitutes.length).toBeGreaterThan(0);
    expect(substitutes[0]).toBeInstanceOf(Substitute);
  });

  it('should filter substitutes by tags', () => {
    const substitutes = engine.getSubstitutes('butter', ['cake'] as RecipeType[], ['vegan']);
    expect(substitutes.every(s => s.tags.includes('vegan'))).toBe(true);
  });

  it('should return empty array for unsupported recipe type', () => {
    const substitutes = engine.getSubstitutes('butter', ['pancakes'] as RecipeType[]);
    expect(substitutes).toHaveLength(0);
  });

  it('should summarize effects correctly', () => {
    const effectSummary = engine.summarizeEffects({ rise: 'less', texture: 'denser' });
    expect(effectSummary).toBe('rise: less, texture: denser');
  });

  it('should return default message when no effects', () => {
    const effectSummary = engine.summarizeEffects({});
    expect(effectSummary).toBe('No significant changes expected');
  });

  test("getIngredient returns an ingredient by name (case-insensitive)", () => {
    const ingredient = engine.getIngredient("Eggs");
    expect(ingredient).toBeDefined();
    expect(ingredient?.name).toBe("eggs");

    const ingredient2 = engine.getIngredient("eggs");
    expect(ingredient2).toBe(ingredient);
  });

  test("getIngredient returns undefined for missing ingredient", () => {
    const ingredient = engine.getIngredient("unicorn tears");
    expect(ingredient).toBeUndefined();
  });

  test("getSubstitutes filters by recipe type", () => {
    const subsCake = engine.getSubstitutes("eggs", ["cake"]);
    subsCake.forEach((s) => {
      expect(engine.getIngredient("eggs")!.substitutes[0].recipeTypes).toContain("cake");
    });

    const subsBread = engine.getSubstitutes("eggs", ["bread"]);
    subsBread.forEach((s) => {
      expect(engine.getIngredient("eggs")!.substitutes[0].recipeTypes).toContain("bread");
    });
  });

  test("getSubstitutes filters by tags", () => {
    const subsVegan = engine.getSubstitutes("eggs", ["bread"], ["vegan"]);
    expect(subsVegan.length).toBeGreaterThan(0);
    subsVegan.forEach((s) => {
      expect(s.tags).toContain("vegan");
    });

    const subsVegetarian = engine.getSubstitutes("eggs", ["bread"], ["vegetarian"]);
    expect(subsVegetarian.length).toBe(0); // eggs substitutes in bread are only vegan
  });

  test("getSubstitutes filters out low confidence", () => {
    // Let's assume there's a substitute with confidence < 0.6
    const subs = engine.getSubstitutes("eggs", ["cookie"]);
    subs.forEach((s) => {
      expect(s.confidence).toBeGreaterThanOrEqual(0.6);
    });
  });

  test("getSubstitutes sorts by confidence and number of effects", () => {
    const subs = engine.getSubstitutes("eggs", ["cookie"]);
    for (let i = 1; i < subs.length; i++) {
      const prev = subs[i - 1];
      const curr = subs[i];
      // confidence should be descending
      expect(prev.confidence).toBeGreaterThanOrEqual(curr.confidence);
      // if confidence equal, prev.effects >= curr.effects
      if (prev.confidence === curr.confidence) {
        expect(Object.keys(prev.effects).length).toBeGreaterThanOrEqual(
          Object.keys(curr.effects).length
        );
      }
    }
  });

  test("summarizeEffects returns readable string", () => {
    const effects = { rise: "less", texture: "denser" };
    const summary = engine.summarizeEffects(effects);
    expect(summary).toContain("rise: less");
    expect(summary).toContain("texture: denser");

    const emptySummary = engine.summarizeEffects({});
    expect(emptySummary).toBe("No significant changes expected");
  });

  test("substitute includes optional instructions if present", () => {
    const subs = engine.getSubstitutes("buttermilk", ["cake"]);
    const withInstructions = subs.filter((s) => s.instructions);
    withInstructions.forEach((s) => {
      expect(typeof s.instructions).toBe("string");
      expect(s.instructions!.length).toBeGreaterThan(0);
    });
  });
});
