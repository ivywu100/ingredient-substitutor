import { Effects } from "@/backend/Effects";
import { IngredientAmount, Substitute } from "@/backend/Substitute";


describe('Substitute class', () => {
  const baseAmount: IngredientAmount = {
    ingredient: 'butter',
    quantity: 1,
    unit: 'cup',
  };

  const substitution: IngredientAmount[] = [
    { ingredient: 'coconut oil', quantity: 1, unit: 'cup' },
  ];

  const effects: Effects = {
    texture: 'slightly denser',
  };

  it('should create a Substitute instance without instructions', () => {
    const sub = new Substitute('coconut oil', baseAmount, substitution, ['vegan'], effects, 0.8);

    expect(sub.name).toBe('coconut oil');
    expect(sub.baseAmount).toEqual(baseAmount);
    expect(sub.substitution).toEqual(substitution);
    expect(sub.instructions).toBeUndefined();
    expect(sub.tags).toEqual(['vegan']);
    expect(sub.effects).toEqual(effects);
    expect(sub.confidence).toBe(0.8);
  });

  it('should create a Substitute instance with instructions', () => {
    const instructions = 'Use melted before adding to batter';
    const sub = new Substitute('coconut oil', baseAmount, substitution, ['vegan'], effects, 0.8, instructions);

    expect(sub.instructions).toBe(instructions);
  });

  it('should handle empty tags and effects', () => {
    const sub = new Substitute('coconut oil', baseAmount, substitution, [], {}, 0.5);

    expect(sub.tags).toEqual([]);
    expect(sub.effects).toEqual({});
    expect(sub.confidence).toBe(0.5);
  });
});
