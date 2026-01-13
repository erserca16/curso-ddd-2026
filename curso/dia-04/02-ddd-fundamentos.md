# Módulo 9 — Domain-Driven Design (DDD): fundamentos (estratégico → táctico)

> Este documento conecta DDD con límites de microservicios y modelos coherentes por contexto.

## 0. ¿Qué es DDD?

DDD (*Domain‑Driven Design*) es un enfoque de diseño en el que el **dominio (negocio)** guía la forma del software: modelamos reglas e invariantes con el **lenguaje del negocio**, y hacemos que el código sea una representación fiel y evolutiva de ese conocimiento.

DDD se trabaja en dos planos complementarios:

- **Patrones estratégicos**: dividir el problema en subdominios y **contextos delimitados**, y definir sus relaciones.
- **Patrones tácticos**: expresar el modelo dentro de cada contexto con entidades, value objects, agregados, eventos, repositorios y casos de uso.

## 1. Patrones estratégicos

Antes de abordar los modelos de dominio, es crucial entender los cimientos que hacen posible el diseño guiado por el dominio:

```mermaid
flowchart TD
    A[Lenguaje Ubicuo] --> B(Bounded Contexts)
    A --> C(Subdominios)
    B --> D[Core]
    B --> E[Soporte]
    B --> F[Genérico]
    C --> G[Límites explícitos]
    C --> H[Modelos autocontenidos]
    D --> I[Innovación diferencial]
    E --> J[Apoya al Core]
    F --> K[Comodities estandarizados]
```

---

## 2. Lenguaje ubicuo (Lenguaje común): la columna vertebral de DDD

¿Qué es el lenguaje ubicuo? Un vocabulario compartido entre expertos de negocio y desarrolladores, alineado al **lenguaje empresarial** y reflejado en código, tests y documentación.

Patrones clave:
- Glosario de términos técnicos-negocio (ej: Pedido = Order agregado con Items)
- Diagramas que reflejan lenguaje de negocio (no solo UML técnico)
- Documentación viva en el código (tipos, métodos y tests con nombres de dominio)

## 3. ¿Qué es un contexto delimitado? (Bounded Context)

Un **contexto delimitado** es un límite donde un modelo tiene significado estable. Dentro del contexto, un término (“Pedido”) significa una cosa; fuera, puede significar otra.

| Tipo | Características | Ejemplo en e-commerce |
|------|----------------|----------------------|
| Core | Ventaja competitiva única | Sistema de recomendaciones AI |
| Soporte | Necesario pero no diferenciador | Gestión de inventario |
| Genérico | Problemas comunes ya resueltos | Pasarela de pagos |

### 3.1 Dominios principales (Core Domain)

El **Core Domain** es la parte del negocio donde la organización compite de verdad (ventaja diferencial). Heurísticas para identificarlo:

- Donde hay reglas que cambian con frecuencia por estrategia de negocio.
- Donde “comprar una solución” no resuelve (necesitas modelado propio).
- Donde conviene concentrar a los perfiles más fuertes (y proteger el contexto con contratos claros).

## 4. Subdominios

Principio: "Un término no puede significar dos cosas en el mismo contexto"

Implementación técnica:
- Microservicios con APIs bien definidas
- Módulos/librerías con responsabilidades acotadas
- Eventos de dominio con semántica contextual

### 4.1 Límites

Un buen límite reduce fricción:

- **Invariantes**: qué reglas requieren consistencia fuerte.
- **Lenguaje**: dónde cambia el significado de los términos.
- **Ritmo de cambio**: qué evoluciona junto y qué no.

### 4.2 Límites físicos

Son límites de ejecución/despliegue: procesos, contenedores, redes, DBs. En microservicios, suelen alinearse con bounded contexts, pero se negocian por coste operativo.

### 4.3 Límites de propiedad

El límite de propiedad define **quién es responsable** (equipo/área) de un contexto. Es clave para reducir coordinación y clarificar “quién decide” sobre contratos y evolución.

## 5. Conocimiento y gestión de la complejidad del dominio

DDD es, ante todo, un proceso para convertir **problemas de negocio** en un **modelo del dominio empresarial** que sea útil para construir software.

### 5.1 Problemas de negocio

Un problema de negocio se formula como una necesidad/restricción (“no puedo prometer stock si no hay disponibilidad”) y no como una solución técnica (“pon Redis”).

### 5.2 Descubrimiento del conocimiento

Técnicas comunes: entrevistas con expertos, *Example Mapping*, *Event Storming* y revisión de incidentes/soporte para encontrar reglas reales (las que no estaban en los tickets).

### 5.3 Comunicación

La comunicación continua (negocio ↔ ingeniería) evita que el software modele “suposiciones”. En DDD, el lenguaje ubicuo es el artefacto compartido que reduce malentendidos.

### 5.4 Lenguaje empresarial

Es el vocabulario que el negocio usa: términos, estados, políticas y excepciones. Mantenerlo explícito (glosario + ejemplos) es más efectivo que documentar solo endpoints.

### 5.5 Modelo del dominio empresarial

El modelo del dominio empresarial es una representación conceptual de reglas, estados y procesos: entidades relevantes, invariantes, eventos y decisiones.

### 5.6 ¿Qué es un modelo?

Un modelo es una simplificación útil de la realidad: captura lo importante para tomar decisiones y construir software, ignorando el resto.

### 5.7 Modelado efectivo

- Modela con **ejemplos** (casos normales y bordes) y convierte ejemplos en tests.
- Mantén agregados pequeños y APIs expresivas (métodos con intención, no setters).
- Separa modelos cuando el lenguaje cambia: un “Pedido” no es igual en logística y en pagos.

### 5.8 Modelos inconsistentes en la arquitectura hexagonal

En hexagonal es habitual tener varios modelos (dominio, DTOs HTTP, eventos de integración). La inconsistencia aparece cuando:

- el dominio se contamina con DTOs/ORMs, o
- distintos adapters “redefinen” conceptos (duplicidad semántica).

Antídotos: **traducción en adaptadores**, puertos explícitos, y *anti‑corruption layers* entre contextos.

## 6. Patrones tácticos (de estratégico a implementación)
Estos pilares estratégicos nos llevan naturalmente a implementaciones tácticas:

```mermaid
flowchart LR  
    A[Lenguaje Ubicuo] --> B[Entidades]  
    C[Bounded Contexts] --> D[Agregados]  
    E[Subdominios] --> F[Microservicios]  
    B --> G[Comportamientos encapsulados]  
    D --> H[Límites transaccionales]  
    F --> I[Contextos desacoplados]  
```

Flujo de diseño recomendado:
- Identificar subdominios clave con expertos de negocio.
- Delimitar Bounded Contexts para cada subdominio.
- Modelar agregados y entidades usando el Lenguaje Ubicuo.
- Implementar comportamientos ricos que reflejen reglas de negocio.

---

## 7. El problema del "Anemic Domain Model"

Objetivo: Comprender por qué el modelo anémico dificulta la evolución del software y cómo un dominio rico encapsula reglas, invariantes y comportamientos dentro de las entidades.


Ejemplo en `order-service`:

```ts
// anemic/orderModel.ts  
export interface OrderRow {  
  id: string  
  status: string             // 'PENDING' | 'PAID'  
  items: Array<{ sku: string; qty: number; price: number }>  
}  

export const saveOrder = async (db, row: OrderRow) => {  
  // Toda la lógica de estado y totales vive fuera de la entidad  
  return db.insert('orders', row)  
}
```

**Problemas principales:**  
- Imposible garantizar invariantes (ej. que qty > 0, status sólo permitido).  
- Tests caros (requieren base de datos o mocks de servicios).  
- Refactors que **conllevan** riesgos: si cambias la tabla o el DTO rompes toda la lógica.

Referencia: Martin Fowler, “Anemic Domain Model” – https://martinfowler.com/bliki/AnemicDomainModel.html

---

## 8. Refactor a un Domain Model Rico

Un **modelo rico** coloca la lógica de negocio dentro de las propias entidades y agregados. Así cada objeto sabe cómo validarse y comportarse.

### 8.1 Value Object: Quantity

```ts
// src/domain/value-objects/Quantity.ts  
/**  
 * Value Object que encapsula las reglas de cantidad  
 * - Entero positivo  
 * - Inmutable  
 */  
export class Quantity {  
  private constructor(private readonly qty: number) {}  

  static of(n: number): Quantity {  
    if (!Number.isInteger(n) || n <= 0) throw new Error('Quantity inválida: debe ser entero positivo')  
    return new Quantity(n)  
  }  

  get value(): number {  
    return this.qty  
  }  
}
```

### 8.2 Entity y Aggregate Root: Order

```ts
// src/domain/entities/OrderItem.ts  
import { Quantity } from '../value-objects/Quantity'  

export class OrderItem {  
  constructor(  
    readonly sku: string,  
    readonly quantity: Quantity,  
    readonly priceCents: number  // precio en centavos para evitar decimales  
  ) {  
    if (priceCents < 0) throw new Error('Price inválido: negativo')  
  }  

  // Comportamiento: calcula subtotal de este item  
  subtotal(): number {  
    return this.quantity.value * this.priceCents  
  }  
}
```

```ts
// src/domain/aggregates/Order.ts  
import { OrderItem } from '../entities/OrderItem'  
import { Quantity } from '../value-objects/Quantity'  

export class Order {  
  private items: OrderItem[] = []  
  private status: 'PENDING' | 'PAID' = 'PENDING'  

  constructor(readonly id: string) {}  

  // Agregar un ítem protege invariantes: qty > 0, precio válido  
  addItem(sku: string, qty: number, price: number) {  
    const quantity = Quantity.of(qty)  
    const priceCents = Math.round(price * 100)  
    this.items.push(new OrderItem(sku, quantity, priceCents))  
  }  

  // Transición de estado controlada  
  pay() {  
    if (this.status !== 'PENDING') throw new Error('El pedido ya fue pagado')  
    this.status = 'PAID'  
  }  

  // Lógica de negocio: cálculo del total en decimales  
  total(): number {  
    const sumCents = this.items.reduce((acc, it) => acc + it.subtotal(), 0)  
    return sumCents / 100  
  }  

  get currentStatus(): string {  
    return this.status  
  }  
}
```

### 8.3 Diagrama de flujo de comportamiento

```mermaid
flowchart TB
  subgraph OrderAggregate["Order Aggregate"]
    direction TB
    A["id: string"]
    B["items: OrderItem[]"]
    C["status: PENDING or PAID"]
    D["addItem(sku, qty, price)"]
    E["pay()"]
    F["total(): number"]
  end

  D --> Q["Quantity.of(qty)"]
  D --> P["priceCents = round(price * 100)"]
  Q --> N["new OrderItem(sku, qty, priceCents)"]
  N --> B

  E --> C
  B --> F
```

---

## 9. Puerto de Persistencia

Para mantener el dominio independiente de la base de datos, definimos un puerto en `order-service`:

```ts
// src/domain/ports/OrderRepositoryPort.ts  
import { Order } from '../aggregates/Order'  

export interface OrderRepositoryPort {  
  save(order: Order): Promise<void>  
  findById(id: string): Promise<Order | null>  
}
```

Así la infraestructura (Postgres, Mongo, Redis) implementará este contrato sin contaminar el código de negocio.

---

## 10. Comparativa rápida

Métrica                 | Modelo anémico                 | Modelo rico  
------------------------|--------------------------------|---------------------------------  
Invariantes             | Fuera de la entidad, dispersos | Encapsulados en la entidad       
Tests                   | Integración lenta o mocks invasivos | Unitarios ágiles, sin infra pesada  
Refactor                | Riesgo alto (puede romper todo) | Riesgo moderado, cambios locales  
Legibilidad del código  | Bajo                            | Alto, código autoexplicativo    

---

## 11. Migración gradual y segura

1. **Paralelismo**: crea las nuevas clases (`Order`, `OrderItem`, `Quantity`) sin eliminar aún el código anémico.  
2. **Cobertura de tests**: añade tests unitarios para cada método crítico (`addItem`, `pay`, `total`).  
3. **Use Cases**: adapta los Application Services para instanciar y usar el dominio rico, sin tocar la infraestructura.  
4. **Verificación**: ejecuta el flujo completo (`order-service` + `order-api`) contra Postgres.  
5. **Descontaminación**: elimina el modelo anémico (`orderModel.ts`, `saveOrder`) cuando la cobertura de tests supere el 80%.

---

## 12. Aplicando los distintos patrones a proyectos de Node

- Alinea microservicios con **bounded contexts** (no con tablas o capas técnicas).
- Usa **arquitectura hexagonal** para separar dominio/aplicación/infra y facilitar tests.
- Expresa el lenguaje ubicuo con TypeScript: value objects, enums/union types y métodos con intención.
- Protege contratos: OpenAPI/AsyncAPI + versionado + contract tests para APIs y eventos.
- Diseña operación desde el inicio: *timeouts*, idempotencia, DLQ y observabilidad (logs/métricas/trazas).

**Referencias**  
- Fowler, Martin. “Anemic Domain Model” – https://martinfowler.com/bliki/AnemicDomainModel.html  
- Evans, Eric. *Domain-Driven Design* (2003)  
- Vernon, Vaughn. *Implementing Domain-Driven Design* (2013)  
