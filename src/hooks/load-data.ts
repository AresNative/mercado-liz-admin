import {
  useGetAlmacenQuery,
  useGetComprasQuery,
  useGetMermasQuery,
  useGetMovimientosQuery,
  useGetVentasQuery,
} from "@/actions/reducers/api-reducer";

type QueryHook = (
  queryString: string,
  options: { skip: boolean; refetchOnMountOrArgChange: boolean }
) => any;

const queryMap: Record<string, QueryHook> = {
  "get-compras": useGetComprasQuery,
  "get-ventas": useGetVentasQuery,
  "get-almacen": useGetAlmacenQuery,
  "get-mermas": useGetMermasQuery,
  "get-movimientos": useGetMovimientosQuery,
};

export function useQueryByType(
  selectedQueryType: string,
  buildQueryString: () => string
) {
  const queryHook = queryMap[selectedQueryType];

  if (queryHook) {
    return queryHook(buildQueryString(), {
      skip: false,
      refetchOnMountOrArgChange: true,
    });
  }

  return { data: null, error: null, isLoading: false, refetch: () => {} };
}
