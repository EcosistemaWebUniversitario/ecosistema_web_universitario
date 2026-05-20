# Microservicio: Gestor de Laboratorios

## Descripción
El **Gestor de Laboratorios** es un componente fundamental del Ecosistema Web Universitario. Este microservicio está dedicado exclusivamente a la administración eficiente de los laboratorios informáticos, sus equipos (PCs) y el seguimiento de incidencias técnicas.

## Arquitectura de Roles
El acceso al sistema está restringido y gestionado mediante usuarios autenticados en el microservicio de autenticación central del ecosistema. Se definen dos roles principales:

### 1. Lab_admin
Tiene privilegios totales de administración (CRUD completo). Sus funciones incluyen:
*   Creación, modificación y eliminación de laboratorios.
*   Gestión de personal (Técnicos).
*   Administración de PCs e incidencias técnicas.

### 2. Lab_technician
Personal operativo encargado de la supervisión directa. Sus funciones incluyen:
*   Visualización del inventario de PCs en los laboratorios bajo su control.
*   Gestión integral de incidencias (Crear, leer, actualizar y eliminar) dentro de sus áreas asignadas.

---

## Modelo de Datos
El sistema se estructura mediante tres objetos principales:

| Objeto | Descripción |
| :--- | :--- |
| **Laboratorio** | Unidad física/lógica que alberga múltiples PCs. Tiene un técnico asignado. |
| **PC** | Equipo informático perteneciente a un único laboratorio. Puede tener un incidente activo. |
| **Incidente** | Reporte técnico asociado a una PC. |

### Reglas de Negocio (Relaciones)
*   **Laboratorio - PC:** Relación de 1 a N (Un laboratorio tiene múltiples PCs).
*   **Laboratorio - Técnico:** Relación de 1 a 1 (Cada laboratorio tiene un técnico responsable).
*   **PC - Incidente:** Relación de 1 a 1.
*   **Instancias de Incidentes:** Aunque un tipo de incidente (ej. "Falla de encendido") pueda ser recurrente, cada reporte se trata como una **instancia independiente** por PC, garantizando la trazabilidad individual de cada equipo.

---

## Integración
Este servicio opera de forma desacoplada dentro del ecosistema, recibiendo la identidad del usuario desde el **Microservicio de Autenticación**, asegurando que los roles `Lab_admin` y `Lab_technician` sean validados correctamente antes de procesar cualquier solicitud.

---

## Autores
*   **Luis Enrique Pupo Hernández**
*   *Espacio reservado para otros colaboradores*

---
*Documentación técnica del Ecosistema Web Universitario.*