import {
  useGetAlmacenQuery,
  useGetComprasQuery,
  useGetMermasQuery,
  useGetMovimientosQuery,
  useGetVentasQuery,
} from "@/actions/reducers/api-reducer";

/* type QueryHook = (
  queryString: string,
  options: { skip: boolean; refetchOnMountOrArgChange: boolean }
) => any;
 */
/* const queryMap: Record<string, QueryHook> = {
  "get-compras": useGetComprasQuery,
  "get-ventas": useGetVentasQuery,
  "get-almacen": useGetAlmacenQuery,
  "get-mermas": useGetMermasQuery,
  "get-movimientos": useGetMovimientosQuery,
};
 */
export function useQueryByType(
  selectedQueryType: string,
  buildQueryString: () => string
) {
  const queryString = buildQueryString();

  // Llama todos los hooks con skip: true excepto el seleccionado
  const comprasQuery = useGetComprasQuery(queryString, {
    skip: selectedQueryType !== "get-compras",
    refetchOnMountOrArgChange: true,
  });

  const ventasQuery = useGetVentasQuery(queryString, {
    skip: selectedQueryType !== "get-ventas",
    refetchOnMountOrArgChange: true,
  });

  const almacenQuery = useGetAlmacenQuery(queryString, {
    skip: selectedQueryType !== "get-almacen",
    refetchOnMountOrArgChange: true,
  });

  const mermasQuery = useGetMermasQuery(queryString, {
    skip: selectedQueryType !== "get-mermas",
    refetchOnMountOrArgChange: true,
  });

  const movimientosQuery = useGetMovimientosQuery(queryString, {
    skip: selectedQueryType !== "get-movimientos",
    refetchOnMountOrArgChange: true,
  });

  // Mapear resultados dinámicamente
  const queryResults: Record<string, any> = {
    "get-compras": comprasQuery,
    "get-ventas": ventasQuery,
    "get-almacen": almacenQuery,
    "get-mermas": mermasQuery,
    "get-movimientos": movimientosQuery,
  };

  return (
    queryResults[selectedQueryType] || {
      data: null,
      error: null,
      isLoading: false,
      refetch: () => {},
    }
  );
}
