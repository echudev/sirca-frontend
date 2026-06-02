import { z } from "zod";
import { DataPointSchema, type QueryResult, QueryResultSchema } from "./models";
import { fetchDatosPorEstacion } from "./repository";

// Schema for validation of query parameters
const EstacionQueryParamsSchema = z.object({
  location: z.string().min(1, "Location is required"),
  startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid startDate",
  }),
  endDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid endDate",
  }),
  integration: z.string().min(1, "Integration is required"),
});

type EstacionQueryParams = z.infer<typeof EstacionQueryParamsSchema>;

/**
 * Servicio para manejar la lógica de negocio de datos de contaminantes
 */
export class DatosService {
  /**
   * Valida y procesa los parámetros de consulta
   */
  private validateQueryParams(params: unknown): EstacionQueryParams {
    return EstacionQueryParamsSchema.parse(params);
  }

  /**
   * Obtiene datos de contaminantes con validación y procesamiento
   */
  async getDatosPorEstacion(rawParams: unknown): Promise<QueryResult> {
    try {
      // Validar parámetros
      const validatedParams = this.validateQueryParams(rawParams);

      // Obtener datos del repositorio
      const result = await fetchDatosPorEstacion(validatedParams);

      // Parse data through Zod to convert BigInt values to numbers and handle nulls
      // El repository ya convierte el time a ISO string, pero por seguridad validamos
      const formattedData = result.data.map((row) => {
        // El time ya debería ser un string ISO desde el repository
        let timeValue: unknown = row.time;
        if (typeof timeValue === "number") {
          // Por si acaso llega como número (milisegundos)
          timeValue = new Date(Math.round(timeValue)).toISOString();
        } else if (timeValue instanceof Date) {
          timeValue = timeValue.toISOString();
        } else if (typeof timeValue !== "string") {
          timeValue = String(timeValue || "");
        }

        // Zod will convert BigInt to number via preprocess and handle nulls
        return DataPointSchema.parse({
          time: timeValue,
          ...row,
        });
      });

      // Retornar en formato estandarizado con conteo de registros
      const queryResult = {
        data: formattedData,
        meta: {
          location: result.meta.location,
          startDate: result.meta.startDate,
          endDate: result.meta.endDate,
          integration: result.meta.integration,
          count: result.data.length,
        },
      };

      // Validate the entire result structure
      return QueryResultSchema.parse(queryResult);
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
    return ["minute", "hour"];
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
