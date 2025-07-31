# Datos API - Arquitectura Refactorizada

## Estructura de Capas

Esta implementación sigue una arquitectura de capas claramente separadas:

### 1. **Capa de Presentación** (Route Handler)

- **Archivo**: `app/api/datos/route.ts`
- **Responsabilidad**: Manejar solicitudes HTTP, delegar al servicio, manejar errores

### 2. **Capa de Servicio** (Service Layer)

- **Archivo**: `lib/datos/service.ts`
- **Responsabilidad**: Lógica de negocio, validación de parámetros, orquestación

### 3. **Capa de Datos** (Repository)

- **Archivo**: `lib/datos/repository.ts`
- **Responsabilidad**: Acceso directo a la base de datos, queries de InfluxDB

### 4. **Capa de Modelos**

- **Archivo**: `lib/datos/models.ts`
- **Responsabilidad**: Definición de tipos, esquemas de validación con Zod

### 5. **Capa de Utilidades**

- **Archivo**: `lib/datos/utils.ts`
- **Responsabilidad**: Funciones auxiliares para procesamiento de parámetros

## Flujo de Datos

``` md
HTTP Request → Route Handler → Service → Repository → InfluxDB
     ↑              ↓             ↓           ↓
   Client     Validation    Business     Data Access
             & Error Handling  Logic
```

## Uso de la API

### Endpoint Principal

``` typescript
GET /api/datos
```

### Parámetros

| Parámetro | Tipo | Requerido | Valores | Descripción |
|-----------|------|-----------|---------|-------------|
| `contaminant` | string | Sí | "CO", "NO2", "O3", "PM10", "PM25", "SO2" | Contaminante a consultar |
| `locations` | string | No | Comma-separated | Ubicaciones específicas |
| `startDate` | string | Sí | ISO Date | Fecha inicial |
| `endDate` | string | Sí | ISO Date | Fecha final |
| `interval` | string | Sí | "minute", "hour", "day" | Intervalo de agregación |

### Ejemplos de Uso

#### Consulta básica

```bash
curl "/api/datos?contaminant=CO&startDate=2024-01-01&endDate=2024-01-02&interval=hour"
```

#### Con ubicaciones específicas

```bash
curl "/api/datos?contaminant=PM25&locations=centenario,rosario&startDate=2024-01-01&endDate=2024-01-02&interval=day"
```

## Tipos de Respuesta

### Respuesta Exitosa (200)

```json
{
  "data": [
    {
      "time": "2024-01-01T00:00:00Z",
      "value": 15.5,
      "location": "centenario",
      "contaminant": "CO"
    }
  ],
  "meta": {
    "contaminant": "CO",
    "locations": ["centenario"],
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-02T00:00:00.000Z",
    "interval": "hour",
    "count": 24
  }
}
```

### Error de Validación (400)

```json
{
  "error": "Invalid contaminant. Must be one of: CO, NO2, O3, PM10, PM25, SO2"
}
```

## Extensiones y Mantenimiento

### Agregar Nuevo Contaminante

1. Actualizar `ContaminantEnum` en `models.ts`
2. Actualizar mapeo en `repository.ts`
3. Agregar validación en `service.ts` si es necesario

### Agregar Nueva Ubicación

1. Actualizar `LocationEnum` en `models.ts`
2. No se requiere cambio en repository (dinámico)

### Agregar Nuevo Intervalo

1. Actualizar `IntervalEnum` en `models.ts`
2. Actualizar lógica de agregación en `repository.ts`

## Testing

### Test de Integración

```typescript
// Ejemplo de test para el servicio
import { datosService } from "@/lib/datos/service";

const result = await datosService.getDatosPorContaminante({
  contaminant: "CO",
  startDate: "2024-01-01",
  endDate: "2024-01-02",
  interval: "hour"
});
```

## Mejores Prácticas Implementadas

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad única
2. **Validación Temprana**: Parámetros validados en el servicio antes de llegar al repository
3. **Tipado Fuerte**: Uso de TypeScript y Zod para garantizar consistencia
4. **Manejo de Errores**: Errores específicos y mensajes claros
5. **Reutilización**: Funciones auxiliares en utils.ts
6. **Extensibilidad**: Fácil agregar nuevos contaminantes/ubicaciones
7. **Documentación**: Código auto-documentado con tipos y comentarios

## Notas de Migración

Si estás migrando desde la versión anterior:

- Los parámetros de la API permanecen iguales
- La respuesta mantiene compatibilidad hacia atrás
- La lógica de negocio se ha movido al servicio
- Las validaciones ahora son más estrictas y claras
