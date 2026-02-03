import type en from '../../messages/en.json'

/**
 * Utility type that generates a union of all dot-notation paths through a nested object.
 * For example, given { hero: { title: "..." } }, produces "hero.title"
 */
type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
    }[keyof T & string]
  : never

/**
 * Union type of all valid translation keys.
 * Provides compile-time validation and autocomplete for t() function.
 */
export type TranslationKey = NestedKeyOf<typeof en>

/**
 * Full message structure type for optional validation.
 * Can be used to ensure fr.json matches en.json structure.
 */
export type Messages = typeof en
