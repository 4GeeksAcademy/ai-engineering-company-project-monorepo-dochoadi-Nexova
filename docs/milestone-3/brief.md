# Milestone 3 — Project page (4Geeks)

The official 4Geeks project page for this milestone, as the developer copied it from the platform on 2026-11-16. The text is unchanged; only the copy lost some headings and list formatting. Its three images (what to deliver, what will be evaluated, how to submit) are not reproduced: their text is in [`evaluation.md`](./evaluation.md) sections B, A and E. The data to model is in the root [`BRIEFING.md`](../../BRIEFING.md).

## English

Milestone — Building Scripts to Automate Tasks
🎯 Your challenge
📌
You already have your company's public website running with forms and basic validations. Now your tech team needs you to build the first internal functionalities that will make the business operate more efficiently.
Your manager has assigned you to implement a set of data processing utilities that the team needs for day-to-day operations. This is not a complete interface yet — that will come later — but rather the foundational functions that will allow you to manage, filter, sort, and transform critical business information. Think of this as the logic layer that other systems will use down the line.
These utilities must be written in TypeScript, be reusable, properly typed, and able to run both in the browser and in development environments. The emphasis is on mastering structured data manipulation: collections, objects, searches, sorting, and transformations.
📋 What you're being asked to build
Your tech lead sends you the following brief via email:
From: Tech Lead
To: You
Subject: Core functionalities for data processing
Hi,
We need you to implement a set of TypeScript functions that allow us to efficiently handle the company's main data. The goal is to have solid, well-typed utilities that we can reuse in multiple contexts.

What we need:

1. Collection management system: Functions to filter, sort, search, and group elements within arrays. You must implement linear search for unsorted arrays and binary search for sorted arrays. Make sure to properly handle empty cases and elements not found.
2. Data modeling with objects and interfaces: Define the TypeScript interfaces that represent the main business entities. Each interface must have explicit types for all its properties and auxiliary methods to work with that data. Use literal objects to represent concrete instances.
3. Transformations and aggregations: Implement functions that take collections of objects and generate simple reports: count elements by category, sum numeric values, find maximums and minimums, calculate averages. Everything must be typed.
4. Business validations: Create functions that validate that data complies with your company's specific rules before being processed or stored. For example, verify that an element has all required fields, that numeric values are within allowed ranges, or that dates are coherent.

The code must be clean, with descriptive names, and each function must have a single responsibility. We want this to be maintainable in the long term.
Check your company's context document to know exactly what entities to model, what validations to apply, and what reports to generate.
Best regards,
Tech Lead

💡 What you should know before starting
This milestone focuses exclusively on programming logic and data manipulation with TypeScript. You are encouraged to solve this challenge without AI support or, if needed, with only minimal AI usage, so you can strengthen your logical and analytical thinking and problem-solving skills, which are fundamental for every programmer.
Key concepts you'll apply:

* Arrays and matrices: How to store, traverse, sort, and search for elements in collections.
* Linear search vs binary search: When to use each one and how to implement them correctly.
* Interfaces and literal objects: How to model real-world data in TypeScript with explicit types.
* Pure functions: Writing functions that only work with what they receive as parameters, without depending on global variables.
* Functional transformations: Using `.map()`, `.filter()`, `.reduce()`, and other array methods to transform data without explicit loops.
* Validations: How to write functions that verify data complies with business rules before processing it.

Expected file structure:
Your implementation should be organized in separate TypeScript files by responsibility:

```
src/
├── types/
│   └── models.ts          # Interfaces and types
├── utils/
│   ├── collections.ts     # Array functions
│   ├── search.ts          # Linear and binary searches
│   ├── transformations.ts # Aggregations and reports
│   └── validations.ts     # Business validations
└── index.html             # Test page (optional)
```

You can include a simple HTML page with Tailwind CSS to manually test your functions if you wish, but the main focus is on the TypeScript logic. At minimum, your project must include a clear command to validate or execute the TypeScript code during development, such as `npx tsc --noEmit`, `npm run typecheck`, or `npx tsx src/demo.ts`.

Read your BRIEFING.md file completely before writing code. There you will find:

The specific entities you must model (products, customers, orders, etc.)
The exact field names and their types
Your company's specific validation rules
The reports you must generate
Create a branch for this work:

git switch -c feature/domain-models
Organize your code in the proposed folder structure and start implementing the functions.

Make sure the project can be validated or executed with a clear TypeScript command during development. Example:

npx tsc --noEmit

## Spanish guide (phases 2 to 7, as published)

Fase 2: Definición de interfaces y tipos base
En `src/types/models.ts`, modela con tipos explícitos cada una de las entidades que leíste en el briefing.

```
// Ejemplos genéricos — adapta los nombres a tu BRIEFING.md
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
}
```

Fase 3: Implementación de algoritmos de búsqueda
En `src/utils/search.ts`, crea las funciones para encontrar elementos dentro de colecciones.

* Búsqueda lineal: recorre arrays desordenados con métodos de array o bucles tradicionales.
* Búsqueda binaria: requiere que el array esté previamente ordenado por la clave de búsqueda. Devuelve el índice o `-1` si no existe.

Fase 4: Manejo y ordenamiento de colecciones
En `src/utils/collections.ts`, escribe funciones puras (que no modifiquen el array original):

* Filtrado: crea funciones que reciban una lista y criterios (ej. rango de precio, estado).
* Ordenamiento: implementa utilidades para ordenar ascendente o descendentemente creando copias del array (`[...array].sort(...)`).

Fase 5: Transformaciones y generación de reportes
En `src/utils/transformations.ts`, crea funciones de agregación tipadas para generar estadísticas sobre los datos de la empresa:

* Conteo de items por categoría.
* Suma total de montos o valores numéricos.
* Cálculo de promedios, valores mínimos y máximos.
* Uso de `.reduce()`, `.map()` y `.filter()`.

Fase 6: Validaciones de reglas de negocio
En `src/utils/validations.ts`, define funciones que verifiquen que un objeto cumple con los requisitos del negocio antes de procesarlo (campos obligatorios presentes, precios mayores a `0`, fechas coherentes).
Fase 7: Verificación, pruebas y Pull Request
Comprueba que todo tu código compile sin errores ejecutando:

```
npx tsc --noEmit
```

Opcionalmente, prueba tus funciones creando un script ejecutable (por ejemplo, con `npx tsx src/demo.ts`) o construyendo un `index.html` simple.
