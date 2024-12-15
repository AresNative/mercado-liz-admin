const {
  NEXT_PUBLIC_API_URL: api = "https://api.mercadosliz.com:29010/api/v1/",
  NEXT_PUBLIC_MODE: mode = "Dev",
  itemsPerPage: items_per_page = "8",
} = process.env;

export const EnvConfig = () => ({
  api,
  mode,
  items_per_page,
});
