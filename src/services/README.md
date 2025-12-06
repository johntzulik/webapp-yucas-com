# Servicios API - Las Yucas

## apiService

Servicio centralizado para realizar peticiones a la API de WordPress con gestión automática de autenticación mediante tokens JWT.

### Características

- Gestión automática de tokens de autenticación
- Headers configurados automáticamente
- Manejo de errores centralizado
- Métodos HTTP genéricos (GET, POST, PUT, DELETE)
- Endpoints específicos para el dashboard

### Uso Básico

```javascript
import { apiService } from './services/apiService'

// Obtener últimos pagos
const response = await apiService.getUltimosPagos()

// Obtener balance total
const balance = await apiService.getBalanceTotal()

// Obtener balance mensual
const balanceMensual = await apiService.getBalanceMensual('NOVIEMBRE', '2025')

// Obtener pagos generales con filtros
const pagos = await apiService.getPagosGenerales({ mes: 'NOVIEMBRE', year: '2025' })
```

### Métodos Disponibles

#### HTTP Genéricos

- `get(endpoint, options)` - Realizar petición GET
- `post(endpoint, body, options)` - Realizar petición POST
- `put(endpoint, body, options)` - Realizar petición PUT
- `delete(endpoint, options)` - Realizar petición DELETE

#### Endpoints Específicos

- `getUltimosPagos()` - Obtiene los últimos 10 pagos registrados
- `getBalanceTotal()` - Obtiene el balance total acumulado
- `getBalanceMensual(mes, year)` - Obtiene el balance de un mes específico
- `getPagosGenerales(filtros)` - Obtiene pagos con filtros opcionales

### Agregar Nuevos Endpoints

Para agregar un nuevo endpoint, edita el archivo `apiService.js`:

```javascript
// En la sección de ENDPOINTS ESPECÍFICOS
async getNuevoEndpoint(parametros) {
  return this.get(`/ruta/del/endpoint?param=${parametros}`)
}
```

### Autenticación

El servicio obtiene automáticamente el token JWT desde `localStorage` (clave: `auth_token`) y lo incluye en todas las peticiones mediante el header `Authorization: Bearer {token}`.

## Otros Servicios

### empleadosService

Servicio para gestión de empleados con encriptación de datos.

### encryptionService

Servicio para encriptar y desencriptar información sensible.
