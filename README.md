# Gestión de Autores - CRUD Application

## Arquitectura de la Solución

Esta aplicación implementa un sistema CRUD completo para la gestión de autores utilizando **Next.js 14** con **App Router** y **TypeScript**. La arquitectura sigue un patrón de componentes modulares donde cada funcionalidad está encapsulada en hooks personalizados (`useAuthors`) que manejan las operaciones de API, mientras que el estado global de favoritos se gestiona mediante **React Context**. Los componentes están diseñados siguiendo principios de accesibilidad web y reutilización, con una separación clara entre lógica de negocio, estado de la aplicación y presentación.

El sistema utiliza **Tailwind CSS** para el diseño responsivo y **react-hot-toast** para notificaciones accesibles. La aplicación se estructura en páginas principales (listado, creación, edición y detalle de autores) con componentes compartidos como `AuthorCard`, implementando navegación fluida y gestión de estados de carga y error de forma consistente en toda la aplicación.

## Parte B Desarrollada: Accesibilidad

**Opción seleccionada:** Accesibilidad

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