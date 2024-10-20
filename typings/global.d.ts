declare type Nullable<T> = T | null
declare type Recordable<T = unknown> = Record<string, T>
declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
