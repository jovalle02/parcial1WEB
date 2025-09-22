# Gestión de Autores - CRUD Application

## Arquitectura de la Solución

Esta aplicación implementa un sistema CRUD completo para la gestión de autores utilizando **Next.js 14** con **App Router** y **TypeScript**. La arquitectura sigue un patrón de componentes modulares donde cada funcionalidad está encapsulada en hooks personalizados (`useAuthors`) que manejan las operaciones de API, mientras que el estado global de favoritos se gestiona mediante **React Context**. Los componentes están diseñados siguiendo principios de accesibilidad web y reutilización, con una separación clara entre lógica de negocio, estado de la aplicación y presentación.

El sistema utiliza **Tailwind CSS** para el diseño responsivo y **react-hot-toast** para notificaciones accesibles. La aplicación se estructura en páginas principales (listado, creación, edición y detalle de autores) con componentes compartidos como `AuthorCard`, implementando navegación fluida y gestión de estados de carga y error de forma consistente en toda la aplicación.

## Parte B Desarrollada: Accesibilidad

**Opción seleccionada:** Accesibilidad

Para cumplir con el apartado de accesibilidad, se hizo un proceso iterativo sobre cada una de las rutas con el fin de modificar todos los componentes necesarios para asegurar la accesibilidad completa de la aplicacion. Por ejemplo, en todas las paginas se encuentran props "aria" para mejorar la accesibilidad, tambien se anadieron ids y efectos visuales que le permiten al usuario recibir feedback sobre sus interacciones (mensajes de error, mensajes de confirmacion, etc.)

### Características Implementadas:

#### 1. Navegación con teclado
- **Tabulación ordenada** en todos los formularios y elementos interactivos
- **Focus visible** con anillos de enfoque personalizados en botones, enlaces y campos
- **Soporte completo de teclado** (Enter y Espacio) en botones personalizados

#### 2. Atributos ARIA en formularios
- **`aria-label`** y **`aria-labelledby`** para describir acciones específicas
- **`aria-invalid`** y **`aria-describedby`** para campos con errores
- **`fieldset`** y **`legend`** para agrupación semántica de formularios
- **Referencias explícitas** entre labels e inputs con `htmlFor` e `id`

#### 3. Comportamiento accesible en cambios de estado
- **`aria-pressed="true/false"`** en botón de favoritos
- **`role="alert"`** para errores críticos
- **`role="status"`** para confirmaciones y cambios no críticos
- **`aria-live`** con valores apropiados (polite/assertive)

### Cómo Validar la Accesibilidad:

#### Validación Manual:
1. **Navegación por teclado:** Usa solo la tecla Tab para navegar por toda la aplicación
2. **Lectores de pantalla:** Se puede revisar la accesibilidad de la aplicacion mediante un lector de pantalla.
3. **Focus visible:** Verifica que todos los elementos interactivos muestren un indicador de foco claro

#### Elementos Específicos a Probar:
- Formularios de creación y edición de autores
- Botón de favoritos con estados aria-pressed
- Mensajes de error con role="alert"
- Toasts accesibles con aria-live
- Navegación completa solo con teclado

## Instrucciones de Instalación y Ejecución

### Instalación

1. **Clona el repositorio:**
```bash
git clone [URL_DEL_REPOSITORIO]
cd gestion-autores
```

2. **Instala las dependencias:**
```bash
npm install
# o
yarn install
# o
pnpm install
```

### Configuración de la API

1. **Configura la URL de la API** en tu archivo de configuración:
```bash
# .env.local (crear si no existe)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8080
```
Esta ip (http://127.0.0.1:8080) es la que corresponde con el backend dado para la ejecucion del preparcial, es decir, es la direccion en la que el backend se ejecuta por defecto.

2. **Asegúrate de que el API esté corriendo** en el puerto configurado con los endpoints:
- `GET /authors` - Listar autores
- `GET /authors/:id` - Obtener autor por ID  
- `POST /authors` - Crear autor
- `PUT /authors/:id` - Actualizar autor
- `DELETE /authors/:id` - Eliminar autor

### Ejecución

#### Modo Desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

La aplicación estará disponible en: **http://localhost:3000**

### Funcionalidades Principales

#### Navegación:
- **`/`** - Página principal con listado de todos los autores
- **`/favoritos`** - Página de autores favoritos (Ojo, durante la ejecucion del parcial, se especifico que no debe ser persistente, por lo tanto, si se actualiza la pagina los favoritos se pierden).
- **`/authors/new`** - Formulario para crear nuevo autor
- **`/authors/[id]`** - Página de detalle del autor
- **`/authors/[id]/edit`** - Formulario para editar autor

### Tecnologías Utilizadas
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hot Toast**
- **Lucide React** (iconos)
