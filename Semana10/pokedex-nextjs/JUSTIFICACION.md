 
PS C:\Users\LENOVO\Documents\Desarrollo_de_Aplicaciones_Web_Avanzado\Semana10> cd pokedex-next-js 
cd : No se encuentra la ruta de acceso 
'C:\Users\LENOVO\Documents\Desarrollo_de_Aplicaciones_Web_Avanzado\Semana10\pokedex-next-js' porque no existe.
En línea: 1 Carácter: 1
+ cd pokedex-next-js
+ ~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : ObjectNotFound: (C:\Users\LENOVO...pokedex-next-js:String) [Set-Location], ItemN 
   otFoundException
    + FullyQualifiedErrorId : PathNotFound,Microsoft.PowerShell.Commands.SetLocationCommand
 
PS C:\Users\LENOVO\Documents\Desarrollo_de_Aplicaciones_Web_Avanzado\Semana10> r3

| Ruta | Estrategia | Por qué |
| --- | --- | --- |
| `/` | SSG | La portada es estática y enlaza los dos universos disponibles. |
| `/pokemon` y sus rutas | ISR según la implementación existente | Se conservan las rutas de Pokémon sin cambios. |
| `/rickandmorty` | SSR con datos `force-cache` | `searchParams` es una API de tiempo de petición en Next.js 16 y permite paginar con `?page=N`; las respuestas de personajes se cachean con `force-cache`. |
| `/rickandmorty/search` | CSR | Los filtros se controlan con estado cliente y consultan la API con debounce y cancelación. |
| `/rickandmorty/[id]` | SSG + ISR cada 10 días | Se generan los IDs de todas las páginas en build y cada ficha puede revalidarse cada 864000 segundos. |
| `/rickandmorty` loading, error y not-found | UI de segmento | Fallback, recuperación de errores y 404 específicos del universo. |

La paginación de la ruta principal requiere leer `searchParams`; según la documentación de Next.js 16 esto hace que la página se renderice por petición. El fetch cacheado mantiene las respuestas de la API reutilizables aunque cambie el número de página.
