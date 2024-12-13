export interface CookieStore {
  get: (name: string) => { value: string } | undefined;
}
