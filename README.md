# readme.md

# Baking Ingredient Substitution Engine

## Overview

This web app helps users find ingredient substitutions for baking recipes (cakes, cookies, bread, etc.) and explains the effects on the recipe using GPT-generated explanations. It minimizes LLM usage through deterministic rules and Redis caching.

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

1. Clone repo:

```bash
git clone <repo-url>
cd baking-substitution-app
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```
OPENAI_API_KEY=<your_api_key>
REDIS_URL=<redis_connection_string>
```

4. Run locally:

```bash
npm run dev
```

5. Deploy on Vercel using standard Next.js deployment workflow.

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

## Scaling and Maintenance

* Add new ingredients/substitutions in `/data/substitutions.json`
* Keep JSON normalized with `recipeTypes`, `tags`, `effects`, `confidence`
* LLM prompts and caching are handled in `pages/api/substitute.ts`
