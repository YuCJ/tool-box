// src/types/react.d.ts
// TypeScript module augmentation to fix common React + TypeScript issues
// Uses TypeScript's Declaration Merging: https://www.typescriptlang.org/docs/handbook/declaration-merging.html

import 'react';

declare module 'react' {
  /**
   * Fix forwardRef return type issue
   * 
   * Problem: React.forwardRef is typed to return ReactElement | null, but components
   * often need to return ReactNode (strings, numbers, fragments, etc.)
   * 
   * Error: "Its return type 'ReactNode' is not a valid JSX element.
   *         Type 'undefined' is not assignable to type 'Element | null'."
   * 
   * References:
   * - Community solution: https://fettblog.eu/typescript-react-generic-forward-refs/
   * - GitHub issue example: https://github.com/emotion-js/emotion/issues/3049
   */
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
  
  /**
   * Fix CSSProperties to support CSS custom properties (CSS variables)
   * 
   * Problem: TypeScript doesn't recognize CSS custom properties like '--my-var'
   * Error: "Object literal may only specify known properties, and ''--my-var'' 
   *         does not exist in type 'Properties<string | number, string & {}>'."
   * 
   * Community solutions for dynamic CSS variables with Tailwind + React:
   * - Set via inline styles: style={{ '--mask-width': '40px' }}
   * - Consume via Tailwind arbitrary values: className="[mask-image:var(--mask-width)]"
   * 
   * References:
   * - Dynamic variables solution: https://dev.to/alanscodelog/how-to-use-dynamic-variables-with-tailwind-4309
   * - Another approach: https://dev.to/mroman7/tailwindcss-dynamic-arbitrary-values-issue-resolved-2m3
   */
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
