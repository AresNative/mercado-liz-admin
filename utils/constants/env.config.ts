const {
  NEXT_PUBLIC_API_URL: api,
  NEXT_PUBLIC_MODE: mode,
  itemsPerPage: items_per_page,
} = process.env;

export const EnvConfig = () => ({
  api,
  mode,
  items_per_page,
});
