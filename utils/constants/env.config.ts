// config.ts
export const EnvConfig = () => ({
  api: (process.env.NEXT_PUBLIC_API_URL =
    "https://api.mercadosliz.com:29010/api/v1/"),
  mode: process.env.NEXT_PUBLIC_MODE,
  itemsPerPage: process.env.ITEMS_PER_PAGE, // Note: This will only be available server-side
});
