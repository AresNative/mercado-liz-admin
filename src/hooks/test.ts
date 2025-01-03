import {
  useGetAlmacenQuery,
  useGetComprasQuery,
  useGetMermasQuery,
  useGetMovimientosQuery,
  useGetVentasQuery,
  useGetAutocompletarComprasQuery,
  useGetAutocompletarVentasQuery,
  useGetGlosarioComprasQuery,
  useGetGlosarioVentasQuery,
} from "@/actions/reducers/api-reducer";

type QueryHook = (queryString: string, options: any) => any;

interface QueryTypeConfig {
  hook: QueryHook;
  skipCondition: (selectedQueryType: string) => boolean;
}

const queryConfigs: Record<string, QueryTypeConfig> = {
  "get-compras": {
    hook: useGetComprasQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-compras",
  },
  "get-ventas": {
    hook: useGetVentasQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-ventas",
  },
  "get-almacen": {
    hook: useGetAlmacenQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-almacen",
  },
  "get-mermas": {
    hook: useGetMermasQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-mermas",
  },
  "get-movimientos": {
    hook: useGetMovimientosQuery,
    skipCondition: (selectedQueryType) =>
      selectedQueryType !== "get-movimientos",
  },
  "get-autocompletar-compras": {
    hook: useGetAutocompletarComprasQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-compras",
  },
  "get-autocompletar-ventas": {
    hook: useGetAutocompletarVentasQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-ventas",
  },
  "get-glosario-compras": {
    hook: useGetGlosarioComprasQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-compras",
  },
  "get-glosario-ventas": {
    hook: useGetGlosarioVentasQuery,
    skipCondition: (selectedQueryType) => selectedQueryType !== "get-ventas",
  },
};

function useDynamicQuery(
  selectedQueryType: string,
  buildQueryString: () => string,
  queryType: string
) {
  const queryString = buildQueryString();
  const { hook, skipCondition } = queryConfigs[queryType];

  if (typeof hook !== "function") {
    console.error(`Hook for query type "${queryType}" is not a function.`);
    return {
      data: null,
      error: new Error(`Hook for query type "${queryType}" is not a function.`),
      isLoading: false,
      refetch: () => {},
    };
  }

  const query = hook(queryString, {
    skip: skipCondition(selectedQueryType),
    refetchOnMountOrArgChange: true,
  });

  return (
    query || { data: null, error: null, isLoading: false, refetch: () => {} }
  );
}

export function useQueryByType(
  selectedQueryType: string,
  buildQueryString: () => string
) {
  return (
    useDynamicQuery(selectedQueryType, buildQueryString, "get-compras") ||
    useDynamicQuery(selectedQueryType, buildQueryString, "get-ventas") ||
    useDynamicQuery(selectedQueryType, buildQueryString, "get-almacen") ||
    useDynamicQuery(selectedQueryType, buildQueryString, "get-mermas") ||
    useDynamicQuery(selectedQueryType, buildQueryString, "get-movimientos")
  );
}

export function useAutocompleteByType(
  selectedQueryType: string,
  buildQueryString: () => string
) {
  return (
    useDynamicQuery(
      selectedQueryType,
      buildQueryString,
      "get-autocompletar-compras"
    ) ||
    useDynamicQuery(
      selectedQueryType,
      buildQueryString,
      "get-autocompletar-ventas"
    )
  );
}

export function useGlosarioByType(selectedQueryType: string) {
  return (
    useDynamicQuery(selectedQueryType, () => "", "get-glosario-compras") ||
    useDynamicQuery(selectedQueryType, () => "", "get-glosario-ventas")
  );
}
