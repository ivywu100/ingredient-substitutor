# Baking Ingredient Substitution Engine

## Overview

This web app helps users find ingredient substitutions for baking recipes (cakes, cookies, bread, etc.) and explains the effects on the recipe using GPT-generated explanations. It minimizes LLM usage through deterministic rules and Redis caching.

Application is deployed at <https://ingredient-substituter.vercel.app/>.

## Features

* Select recipe type, ingredient, and amount
* Optional dietary constraints (e.g., vegan)
* Returns substitution(s) with converted amounts
* Directional effects: rise, spread, texture
* GPT-generated explanations (cached to reduce API calls)
* Lightweight, deterministic rules-based engine

## Tech Stack

* **Next.js App Router + TypeScript**
* **TailwindCSS + Material UI**
* **Next.js API routes** for server logic
* **Static JSON file** for substitution list
* **Redis** for caching LLM responses
* **OpenAI GPT** for explanation generation
* **Vercel** deployment

## Architecture

1. User selects ingredient and recipe type
2. Server API route looks up substitution in static JSON
3. Constructs a deterministic cache key
4. Checks Redis:

   * If hit → returns cached explanation
   * If miss → calls GPT → stores explanation in Redis → returns explanation

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Upstash Redis account (or compatible Redis instance)

### Step-by-Step Setup

1. **Clone the repository:**

```bash
git clone <repo-url>
cd ingredient-substitutor
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env.local` file in the root directory:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here
```

**Getting your credentials:**
- **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Upstash Redis**: Sign up at [Upstash](https://upstash.com/) and create a Redis database. Copy the REST URL and token from the dashboard.

4. **Run the development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

To build and run the production version:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting

Check code quality:

```bash
npm run lint
```

## Usage

1. Select recipe type (cake, cookie, bread, other)
2. Select the ingredient to substitute
3. Enter the amount
4. Optional: select dietary constraints
5. Click **Find Substitution**
6. See recommended substitutions, directional effects, and GPT explanation

## Cost Optimization

* Deterministic rules handle most lookups → no LLM cost
* Redis caches GPT-generated explanations → repeated queries do not incur extra cost
* Short prompts minimize token usage
* Precompute explanations for common substitutions

## Project Structure

```
ingredient-substitutor/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── explanation/   # GPT explanation endpoint
│   ├── page.tsx           # Main page component
│   └── layout.tsx         # Root layout
├── backend/               # Core business logic
│   ├── Ingredient.ts      # Ingredient model
│   ├── Substitute.ts      # Substitute model
│   └── SubstitutionEngine.ts  # Main substitution engine
├── components/            # React components
│   ├── DietaryPreferenceSelector.tsx
│   ├── IngredientSelector.tsx
│   ├── RecipeTypeSelector.tsx
│   ├── ResultsCard.tsx
│   ├── SearchHistoryDrawer.tsx
│   └── ThemeToggle.tsx
├── data/                  # Static data
│   └── substitutions.json # Substitution database
├── lib/                   # Utilities
│   ├── rateLimit.ts      # Rate limiting logic
│   └── redis.ts          # Redis client configuration
├── tests/                 # Test files
│   ├── Ingredient.test.ts
│   ├── Substitute.test.ts
│   └── SubstitutionEngine.test.ts
└── src/theme/            # Material UI theme configuration
```

## Scaling and Maintenance

* Add new ingredients/substitutions in `/data/substitutions.json`
* Keep JSON normalized with `recipeTypes`, `tags`, `effects`, `confidence`
* LLM prompts and caching are handled in `/app/api/explanation/route.ts`
* Rate limiting is configured in `/lib/rateLimit.ts` (currently 5 requests per 60 seconds per IP)

## License

MIT © 2026 Maxwell Lo