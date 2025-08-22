import {
  QueryParamsSchema,
  QueryResult,
  QueryParams,
  Contaminant,
  Interval,
} from "./models";
import { fetchDatosPorContaminante } from "./repository";

/**
 * Servicio para manejar la lógica de negocio de datos de contaminantes
 */
export class DatosService {
  /**
   * Valida y procesa los parámetros de consulta
   */
  private validateQueryParams(params: unknown): QueryParams {
    return QueryParamsSchema.parse(params);
  }

  /**
   * Obtiene datos de contaminantes con validación y procesamiento
   */
  async getDatosPorContaminante(rawParams: unknown): Promise<QueryResult> {
    try {
      // Validar parámetros
      const validatedParams = this.validateQueryParams(rawParams);

      // Obtener datos del repositorio
      const result = await fetchDatosPorContaminante(validatedParams);

      // Ensure data conforms to DataPointSchema (formato original)
      const formattedData = result.data.map(
        (row: Record<string, string | number>) => ({
          time: String(row.time || ""),
          ...row,
        })
      );

      // Retornar en formato estandarizado con conteo de registros
      return {
        data: formattedData,
        meta: {
          ...result.meta,
          contaminant: result.meta.contaminant as Contaminant,
          interval: result.meta.interval as Interval,
          count: result.data.length,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al procesar la consulta: ${error.message}`);
      }
      throw new Error("Error desconocido al procesar la consulta");
    }
  }

  /**
   * Obtiene información sobre los contaminantes disponibles
   */
  getAvailableContaminants(): string[] {
    return ["co", "no2", "no", "nox", "pm10", "pm25", "o3", "so2"];
  }

  /**
   * Obtiene información sobre los intervalos disponibles
   */
  getAvailableIntervals(): string[] {
    return ["minute", "hour", "day"];
  }

  /**
   * Obtiene información sobre las ubicaciones disponibles
   */
  getAvailableLocations(): string[] {
    return ["centenario", "cordoba", "catalinas", "cifa"];
  }
}
// Exportar instancia singleton
export const datosService = new DatosService();
