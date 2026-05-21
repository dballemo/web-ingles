/*
 * repository.js — High-Yield Chunks Database
 *
 * Technical Business English chunks optimized for SRS.
 * Categories: presentation, vendor, rfp, infrastructure, api, deployment, troubleshooting
 *
 * Also exports the daily challenge variable pools.
 */
const REPOSITORY = {
  chunks: [
    {
      id: "intro_01",
      category: "presentation",
      spanish: "Hola a todos, soy el Tech Lead del proyecto. Gestiono los requerimientos técnicos.",
      english: "Hello everyone, I'm the Tech Lead for this project. I handle the technical requirements.",
      keywords: ["Tech Lead", "handle", "requirements"]
    },
    {
      id: "intro_02",
      category: "presentation",
      spanish: "Trabajo como arquitecto de soluciones en el equipo de infraestructura cloud.",
      english: "I work as a solutions architect on the cloud infrastructure team.",
      keywords: ["solutions architect", "cloud infrastructure"]
    },
    {
      id: "intro_03",
      category: "presentation",
      spanish: "Permítanme presentarles la hoja de ruta técnica para el próximo trimestre.",
      english: "Let me walk you through the technical roadmap for the next quarter.",
      keywords: ["walk through", "roadmap", "quarter"]
    },
    {
      id: "intro_04",
      category: "presentation",
      spanish: "Me gustaría resumir los hitos clave que alcanzamos en el sprint anterior.",
      english: "I'd like to recap the key milestones we hit in the previous sprint.",
      keywords: ["recap", "milestones", "sprint"]
    },
    {
      id: "vendor_01",
      category: "vendor",
      spanish: "Dile al proveedor que el sistema Odin necesita desacoplarse.",
      english: "Tell the vendor that the Odin system needs to be decoupled.",
      keywords: ["vendor", "decoupled", "Odin system"]
    },
    {
      id: "vendor_02",
      category: "vendor",
      spanish: "Necesitamos que el proveedor nos envíe la documentación de la API antes del viernes.",
      english: "We need the vendor to send us the API documentation by Friday.",
      keywords: ["vendor", "API documentation", "by Friday"]
    },
    {
      id: "vendor_03",
      category: "vendor",
      spanish: "El SLA actual no cubre tiempos de respuesta inferiores a 4 horas. Hay que renegociarlo.",
      english: "The current SLA doesn't cover response times under 4 hours. We need to renegotiate it.",
      keywords: ["SLA", "response times", "renegotiate"]
    },
    {
      id: "vendor_04",
      category: "vendor",
      spanish: "Pregúntales si soportan despliegues multi-región con failover automático.",
      english: "Ask them if they support multi-region deployments with automatic failover.",
      keywords: ["multi-region", "deployments", "failover"]
    },
    {
      id: "vendor_05",
      category: "vendor",
      spanish: "El proveedor asegura que la migración se completará sin pérdida de datos.",
      english: "The vendor guarantees that the migration will be completed with zero data loss.",
      keywords: ["vendor", "migration", "data loss"]
    },
    {
      id: "rfp_01",
      category: "rfp",
      spanish: "Hemos revisado tres RFPs y este proveedor ofrece la mejor relación costo-beneficio.",
      english: "We've reviewed three RFPs and this vendor offers the best cost-benefit ratio.",
      keywords: ["RFPs", "vendor", "cost-benefit ratio"]
    },
    {
      id: "rfp_02",
      category: "rfp",
      spanish: "El pliego de condiciones exige cumplimiento con ISO 27001 y SOC 2.",
      english: "The request for proposal requires ISO 27001 and SOC 2 compliance.",
      keywords: ["request for proposal", "compliance", "ISO 27001", "SOC 2"]
    },
    {
      id: "rfp_03",
      category: "rfp",
      spanish: "Tenemos que evaluar si el proveedor puede escalar a 10.000 usuarios concurrentes.",
      english: "We need to assess whether the vendor can scale to 10,000 concurrent users.",
      keywords: ["assess", "scale", "concurrent users"]
    },
    {
      id: "infra_01",
      category: "infrastructure",
      spanish: "La infraestructura core de Odin corre sobre Kubernetes con auto-scaling.",
      english: "Odin's core infrastructure runs on Kubernetes with auto-scaling.",
      keywords: ["core infrastructure", "Kubernetes", "auto-scaling"]
    },
    {
      id: "infra_02",
      category: "infrastructure",
      spanish: "Migraremos los microservicios legacy a una arquitectura orientada a eventos.",
      english: "We'll migrate the legacy microservices to an event-driven architecture.",
      keywords: ["migrate", "legacy", "event-driven architecture"]
    },
    {
      id: "infra_03",
      category: "infrastructure",
      spanish: "El balanceador de carga distribuye el tráfico entre tres zonas de disponibilidad.",
      english: "The load balancer distributes traffic across three availability zones.",
      keywords: ["load balancer", "distributes", "availability zones"]
    },
    {
      id: "infra_04",
      category: "infrastructure",
      spanish: "Implementamos circuit breakers para evitar fallos en cascada entre servicios.",
      english: "We implemented circuit breakers to prevent cascading failures across services.",
      keywords: ["circuit breakers", "cascading failures"]
    },
    {
      id: "api_01",
      category: "api",
      spanish: "La API gateway gestiona autenticación, rate limiting y versionado.",
      english: "The API gateway handles authentication, rate limiting, and versioning.",
      keywords: ["API gateway", "authentication", "rate limiting", "versioning"]
    },
    {
      id: "api_02",
      category: "api",
      spanish: "Expusimos un endpoint RESTful que devuelve el estado del despliegue en tiempo real.",
      english: "We exposed a RESTful endpoint that returns the deployment status in real time.",
      keywords: ["exposed", "RESTful endpoint", "deployment status"]
    },
    {
      id: "api_03",
      category: "api",
      spanish: "La integración entre servicios usa colas de mensajería con RabbitMQ.",
      english: "The service-to-service integration uses message queues with RabbitMQ.",
      keywords: ["integration", "message queues", "RabbitMQ"]
    },
    {
      id: "api_04",
      category: "api",
      spanish: "Documentamos todos los endpoints con OpenAPI 3.0 para que los consumidores generen sus SDKs.",
      english: "We document all endpoints with OpenAPI 3.0 so consumers can generate their SDKs.",
      keywords: ["document", "endpoints", "OpenAPI", "SDKs"]
    },
    {
      id: "deploy_01",
      category: "deployment",
      spanish: "El pipeline de CI/CD ejecuta tests unitarios, de integración y escaneo de seguridad.",
      english: "The CI/CD pipeline runs unit tests, integration tests, and security scanning.",
      keywords: ["pipeline", "unit tests", "integration tests", "security scanning"]
    },
    {
      id: "deploy_02",
      category: "deployment",
      spanish: "Hacemos despliegues canary para validar cada release con un 5% del tráfico real.",
      english: "We use canary deployments to validate each release with 5% of live traffic.",
      keywords: ["canary deployments", "validate", "release", "live traffic"]
    },
    {
      id: "deploy_03",
      category: "deployment",
      spanish: "El rollback es instantáneo si los errores 5xx superan el umbral del 1%.",
      english: "The rollback is instant if 5xx errors exceed the 1% threshold.",
      keywords: ["rollback", "5xx errors", "threshold"]
    },
    {
      id: "deploy_04",
      category: "deployment",
      spanish: "Programamos las ventanas de mantenimiento los domingos a las 3 AM UTC.",
      english: "We schedule maintenance windows on Sundays at 3 AM UTC.",
      keywords: ["schedule", "maintenance windows"]
    },
    {
      id: "tshoot_01",
      category: "troubleshooting",
      spanish: "Los logs muestran timeouts intermitentes entre el frontend y el backend desde las 14:00.",
      english: "The logs show intermittent timeouts between the frontend and the backend since 2 PM.",
      keywords: ["logs", "intermittent timeouts", "frontend", "backend"]
    },
    {
      id: "tshoot_02",
      category: "troubleshooting",
      spanish: "Aislé el problema: es una fuga de conexiones en el pool de base de datos.",
      english: "I've isolated the issue: it's a connection leak in the database pool.",
      keywords: ["isolated", "connection leak", "database pool"]
    },
    {
      id: "tshoot_03",
      category: "troubleshooting",
      spanish: "Escalamos el incidente al equipo de operaciones porque afecta a producción.",
      english: "We've escalated the incident to the operations team because it's affecting production.",
      keywords: ["escalated", "incident", "operations", "production"]
    },
    {
      id: "tshoot_04",
      category: "troubleshooting",
      spanish: "La causa raíz fue un cambio de configuración que no pasó por revisión de pares.",
      english: "The root cause was a configuration change that didn't go through peer review.",
      keywords: ["root cause", "configuration change", "peer review"]
    }
  ],

  /*
   * Daily Challenge Variable Pools
   * Three axes of randomness to prevent neural habituation.
   */
  dailyPools: {
    roles: [
      "Introducing yourself",
      "Vendor Q&A",
      "RFP Review",
      "Sprint Retrospective",
      "Client Onboarding Call",
      "Incident Post-Mortem",
      "Architecture Review",
      "Stakeholder Update"
    ],
    techEnvironments: [
      "Odin core infrastructure",
      "API integration layer",
      "Deployment pipeline",
      "Database migration",
      "Security audit",
      "Monitoring & observability",
      "Load testing",
      "Disaster recovery drill"
    ],
    stressConstraints: [
      "20-second timebox",
      "No common connectors (and, but, so)",
      "Start every sentence with a verb",
      "No filler words (um, like, you know)",
      "Use at least 3 technical acronyms",
      "Pause 2 seconds between sentences",
      "Speak at 75% of your normal pace",
      "Use only present tense"
    ]
  }
};
