import {
  useGetAlmacenQuery,
  useGetComprasQuery,
  useGetMermasQuery,
  useGetMovimientosQuery,
  useGetVentasQuery,
  /*  */
  useGetAutocompletarComprasQuery,
  useGetAutocompletarVentasQuery,
  useGetGlosarioComprasQuery,
  useGetGlosarioVentasQuery,
} from "@/actions/reducers/api-reducer";

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
export function useAutocompleteByType(
  selectedQueryType: string,
  buildQueryString: string
) {
  // Llama todos los hooks con skip: true excepto el seleccionado
  const comprasQuery = useGetAutocompletarComprasQuery(buildQueryString, {
    skip: selectedQueryType !== "get-compras",
    refetchOnMountOrArgChange: true,
  });

  const ventasQuery = useGetAutocompletarVentasQuery(buildQueryString, {
    skip: selectedQueryType !== "get-ventas",
    refetchOnMountOrArgChange: true,
  });

  // Mapear resultados dinámicamente
  const queryResults: Record<string, any> = {
    "get-compras": comprasQuery,
    "get-ventas": ventasQuery,
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

export function useGlosarioByType(selectedQueryType: string) {
  // Llama todos los hooks con skip: true excepto el seleccionado
  const comprasQuery = useGetGlosarioComprasQuery({
    skip: selectedQueryType !== "get-compras",
    refetchOnMountOrArgChange: true,
  });

  const ventasQuery = useGetGlosarioVentasQuery({
    skip: selectedQueryType !== "get-ventas",
    refetchOnMountOrArgChange: true,
  });

  // Mapear resultados dinámicamente
  const queryResults: Record<string, any> = {
    "get-compras": comprasQuery,
    "get-ventas": ventasQuery,
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
