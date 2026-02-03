# Sesión 3 · Martes 03-feb-2026  
## Repaso exprés de la Sesión 2

Antes de profundizar en **límites de dominio** y continuar consolidando Arquitectura Hexagonal, conviene repasar los aprendizajes del día anterior.

> Hoy seguimos usando un ejemplo **local** (el mini‑proyecto de ejercicios de la sesión 2). Si lo creaste dentro del repo, estará en `curso/dia-02/ejercicios/` (no está versionado). Si aún no lo tienes, usa la guía `curso/dia-02/04-ejercicios.md`. La idea es practicar límites, contratos y testing sin depender de infra, y al final hacer el “transfer” al `inventory-service`.

Tema | Insight clave | Acción inmediata
-----|--------------|----------------
Ports & Adapters | Puertos específicos (1–3 métodos) + adaptadores finos reducen el acoplamiento | Revisa tus handlers HTTP: si mezclan reglas de negocio, muévelas a un Use Case.
DI / Awilix | El container se “cablea” en el arranque; el dominio no resuelve dependencias | Busca `container.resolve` fuera de `main.ts`/infra y elimínalo del core.
Hexagonal vs. Clean/Onion | Hexagonal enfatiza entradas/salidas; Clean/Onion enfatizan capas concéntricas | Identifica qué decisión te aporta más valor hoy: ¿cambiar infraestructura sin tocar dominio o reforzar capas por política?
Límites de dominio | Sin límites claros, los servicios tienden a “mezclar modelos” y crecer sin control | Escribe 2 términos que cambian de significado según el área (p. ej. “pedido”) y plantea un posible bounded context.


Con estas premisas en mente, entramos en **cómo decidir límites de dominio** y cómo esos límites se reflejan en puertos, adaptadores y contratos.
