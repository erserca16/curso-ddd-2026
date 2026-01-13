## 1. Repaso de la Sesión 1

Antes de adentrarnos en Arquitectura Hexagonal, repasemos los conceptos clave que cubrimos ayer, su importancia y un pequeño reto práctico para afianzar cada uno.

| Concepto | Descripción resumida | Micro-challenge |
|----------|-----------------------|-----------------|
| **Microservicios** | Servicios autónomos alineados a capacidades de negocio, con contratos explícitos y operación distribuida. | Elige una capacidad (Pedidos/Inventario/Pagos) y escribe 3 responsabilidades que **sí** y 3 que **no** deben vivir en ese servicio. |
| **Límites de dominio (bounded context)** | Delimitar modelos y ownership para reducir acoplamiento y conflictos semánticos. | Lista 5 términos del negocio; marca cuáles cambian de significado según el contexto (p. ej. “pedido” en logística vs facturación). |
| **Contratos (API vs eventos)** | Decidir cuándo usar comunicación síncrona y cuándo eventos para desacoplar. | Para un flujo de “checkout”: ¿qué iría por API y qué por evento? Justifica en 2 líneas. |
| **Big Ball of Mud** | Monolito degradado donde la lógica de negocio y la técnica se enredan. | Localiza en tu código un área con alta densidad de dependencias cruzadas y anota qué límite te habría evitado ese acoplamiento. |
| **Arquitectura Hexagonal** | Separación clara entre **dominio** (reglas) e **infraestructura** (DB, frameworks, APIs) mediante puertos y adaptadores. | Dibuja un diagrama simple de puertos/adaptadores para el servicio que elegiste arriba. |

> Esta sesión profundiza en **Arquitectura Hexagonal** como base para implementar microservicios con un core estable y testeable.
