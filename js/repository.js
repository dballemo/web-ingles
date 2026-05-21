/*
 * repository.js — High-Yield Chunks Database
 *
 * Technical Business English chunks optimized for SRS.
 * Each chunk includes `critical_phoneme` for shadowing pronunciation focus.
 *
 * Categories: presentation, rfp_vendors, odin_service, infrastructure,
 *             api, deployment, troubleshooting
 */

const REPOSITORY = {
  chunks: [
    // ---- Presentation ----
    {
      id: "intro_01",
      category: "presentation",
      spanish: "Hola a todos, soy el Tech Lead del proyecto. Gestiono los requerimientos técnicos.",
      english: "Hi everyone, I am the Tech Lead for this project. I manage the technical requirements.",
      critical_phoneme: "Tech Lead / manage"
    },
    {
      id: "intro_02",
      category: "presentation",
      spanish: "Trabajo como arquitecto de soluciones en el equipo de infraestructura cloud.",
      english: "I work as a solutions architect on the cloud infrastructure team.",
      critical_phoneme: "solutions architect / cloud infrastructure"
    },
    {
      id: "intro_03",
      category: "presentation",
      spanish: "Permítanme presentarles la hoja de ruta técnica para el próximo trimestre.",
      english: "Let me walk you through the technical roadmap for the next quarter.",
      critical_phoneme: "walk you through / roadmap"
    },
    {
      id: "intro_04",
      category: "presentation",
      spanish: "Me gustaría resumir los hitos clave que alcanzamos en el sprint anterior.",
      english: "I'd like to recap the key milestones we hit in the previous sprint.",
      critical_phoneme: "recap / milestones / sprint"
    },

    // ---- RFP & Vendors ----
    {
      id: "rfp_01",
      category: "rfp_vendors",
      spanish: "¿Esta característica está soportada de forma nativa o requiere desarrollo a medida?",
      english: "Is this feature supported out of the box or does it require custom development?",
      critical_phoneme: "feature / out of the box"
    },
    {
      id: "rfp_02",
      category: "rfp_vendors",
      spanish: "Hemos revisado tres RFPs y este proveedor ofrece la mejor relación costo-beneficio.",
      english: "We've reviewed three RFPs and this vendor offers the best cost-benefit ratio.",
      critical_phoneme: "RFPs / vendor / cost-benefit"
    },
    {
      id: "rfp_03",
      category: "rfp_vendors",
      spanish: "El pliego de condiciones exige cumplimiento con ISO 27001 y SOC 2.",
      english: "The request for proposal requires ISO 27001 and SOC 2 compliance.",
      critical_phoneme: "request for proposal / compliance"
    },
    {
      id: "rfp_04",
      category: "rfp_vendors",
      spanish: "Tenemos que evaluar si el proveedor puede escalar a 10.000 usuarios concurrentes.",
      english: "We need to assess whether the vendor can scale to 10,000 concurrent users.",
      critical_phoneme: "assess / scale / concurrent"
    },
    {
      id: "vendor_01",
      category: "rfp_vendors",
      spanish: "Dile al proveedor que el sistema Odin necesita desacoplarse.",
      english: "Tell the vendor that the Odin system needs to be decoupled.",
      critical_phoneme: "vendor / decoupled"
    },
    {
      id: "vendor_02",
      category: "rfp_vendors",
      spanish: "Necesitamos que el proveedor nos envíe la documentación de la API antes del viernes.",
      english: "We need the vendor to send us the API documentation by Friday.",
      critical_phoneme: "vendor / documentation"
    },
    {
      id: "vendor_03",
      category: "rfp_vendors",
      spanish: "El SLA actual no cubre tiempos de respuesta inferiores a 4 horas. Hay que renegociarlo.",
      english: "The current SLA doesn't cover response times under 4 hours. We need to renegotiate it.",
      critical_phoneme: "SLA / response times / renegotiate"
    },
    {
      id: "vendor_04",
      category: "rfp_vendors",
      spanish: "Pregúntales si soportan despliegues multi-región con failover automático.",
      english: "Ask them if they support multi-region deployments with automatic failover.",
      critical_phoneme: "multi-region / deployments / failover"
    },
    {
      id: "vendor_05",
      category: "rfp_vendors",
      spanish: "El proveedor asegura que la migración se completará sin pérdida de datos.",
      english: "The vendor guarantees that the migration will be completed with zero data loss.",
      critical_phoneme: "migration / data loss"
    },
    {
      id: "blocker_01",
      category: "rfp_vendors",
      spanish: "Necesitamos revisar la documentación de arquitectura porque esto es un bloqueador.",
      english: "We need to review the architecture documentation because this is a blocker.",
      critical_phoneme: "architecture / blocker"
    },

    // ---- Odin Service ----
    {
      id: "odin_01",
      category: "odin_service",
      spanish: "Odin es nuestro servicio central para la automatización de infraestructura. Actualmente estamos desacoplando sus componentes.",
      english: "Odin is our core service for infrastructure automation. We are currently decoupling its components.",
      critical_phoneme: "core service / decoupling"
    },
    {
      id: "odin_02",
      category: "odin_service",
      spanish: "La infraestructura core de Odin corre sobre Kubernetes con auto-scaling.",
      english: "Odin's core infrastructure runs on Kubernetes with auto-scaling.",
      critical_phoneme: "core infrastructure / Kubernetes / auto-scaling"
    },
    {
      id: "odin_03",
      category: "odin_service",
      spanish: "Migraremos los microservicios legacy de Odin a una arquitectura orientada a eventos.",
      english: "We'll migrate Odin's legacy microservices to an event-driven architecture.",
      critical_phoneme: "legacy / event-driven architecture"
    },

    // ---- Infrastructure ----
    {
      id: "infra_01",
      category: "infrastructure",
      spanish: "El balanceador de carga distribuye el tráfico entre tres zonas de disponibilidad.",
      english: "The load balancer distributes traffic across three availability zones.",
      critical_phoneme: "load balancer / availability zones"
    },
    {
      id: "infra_02",
      category: "infrastructure",
      spanish: "Implementamos circuit breakers para evitar fallos en cascada entre servicios.",
      english: "We implemented circuit breakers to prevent cascading failures across services.",
      critical_phoneme: "circuit breakers / cascading failures"
    },

    // ---- API Integration ----
    {
      id: "api_01",
      category: "api",
      spanish: "La API gateway gestiona autenticación, rate limiting y versionado.",
      english: "The API gateway handles authentication, rate limiting, and versioning.",
      critical_phoneme: "API gateway / rate limiting / versioning"
    },
    {
      id: "api_02",
      category: "api",
      spanish: "Expusimos un endpoint RESTful que devuelve el estado del despliegue en tiempo real.",
      english: "We exposed a RESTful endpoint that returns the deployment status in real time.",
      critical_phoneme: "exposed / endpoint / deployment"
    },
    {
      id: "api_03",
      category: "api",
      spanish: "La integración entre servicios usa colas de mensajería con RabbitMQ.",
      english: "The service-to-service integration uses message queues with RabbitMQ.",
      critical_phoneme: "integration / message queues"
    },
    {
      id: "api_04",
      category: "api",
      spanish: "Documentamos todos los endpoints con OpenAPI 3.0 para que los consumidores generen sus SDKs.",
      english: "We document all endpoints with OpenAPI 3.0 so consumers can generate their SDKs.",
      critical_phoneme: "endpoints / OpenAPI / SDKs"
    },

    // ---- Deployment ----
    {
      id: "deploy_01",
      category: "deployment",
      spanish: "El pipeline de CI/CD ejecuta tests unitarios, de integración y escaneo de seguridad.",
      english: "The CI/CD pipeline runs unit tests, integration tests, and security scanning.",
      critical_phoneme: "pipeline / security scanning"
    },
    {
      id: "deploy_02",
      category: "deployment",
      spanish: "Hacemos despliegues canary para validar cada release con un 5% del tráfico real.",
      english: "We use canary deployments to validate each release with 5% of live traffic.",
      critical_phoneme: "canary deployments / live traffic"
    },
    {
      id: "deploy_03",
      category: "deployment",
      spanish: "El rollback es instantáneo si los errores 5xx superan el umbral del 1%.",
      english: "The rollback is instant if 5xx errors exceed the 1% threshold.",
      critical_phoneme: "rollback / errors / threshold"
    },
    {
      id: "deploy_04",
      category: "deployment",
      spanish: "Programamos las ventanas de mantenimiento los domingos a las 3 AM UTC.",
      english: "We schedule maintenance windows on Sundays at 3 AM UTC.",
      critical_phoneme: "maintenance windows"
    },

    // ---- Troubleshooting ----
    {
      id: "tshoot_01",
      category: "troubleshooting",
      spanish: "Los logs muestran timeouts intermitentes entre el frontend y el backend desde las 14:00.",
      english: "The logs show intermittent timeouts between the frontend and the backend since 2 PM.",
      critical_phoneme: "intermittent timeouts"
    },
    {
      id: "tshoot_02",
      category: "troubleshooting",
      spanish: "Aislé el problema: es una fuga de conexiones en el pool de base de datos.",
      english: "I've isolated the issue: it's a connection leak in the database pool.",
      critical_phoneme: "isolated / connection leak / pool"
    },
    {
      id: "tshoot_03",
      category: "troubleshooting",
      spanish: "Escalamos el incidente al equipo de operaciones porque afecta a producción.",
      english: "We've escalated the incident to the operations team because it's affecting production.",
      critical_phoneme: "escalated / incident / production"
    },
    {
      id: "tshoot_04",
      category: "troubleshooting",
      spanish: "La causa raíz fue un cambio de configuración que no pasó por revisión de pares.",
      english: "The root cause was a configuration change that didn't go through peer review.",
      critical_phoneme: "root cause / peer review"
    }
  ],

  /*
   * Meeting Simulator — prompt/email thread templates.
   * Each template sets up a simulated vendor/client interaction.
   */
  meetingTemplates: [
    {
      id: "meet_vendor_inquiry",
      subject: "Re: Odin Infrastructure — Technical Clarification Needed",
      thread: [
        {
          from: "Sarah Chen (Vendor)",
          body: "Hi team, we've reviewed your Odin infrastructure requirements. Before we proceed with the proposal, could you clarify whether the decoupling affects only the orchestration layer or also the data pipeline? We need to estimate the effort for both scenarios."
        },
        {
          from: "You",
          body_hint: "Respond explaining that the decoupling affects both layers, and ask about their experience with event-driven migrations. Use the chunks assigned to you today."
        }
      ]
    },
    {
      id: "meet_rfp_evaluation",
      subject: "RFP #2026-047 — Vendor Shortlist Decision",
      thread: [
        {
          from: "Maria Torres (Procurement)",
          body: "We've narrowed down the RFP responses to two vendors. Both meet the ISO 27001 requirement, but Vendor A has better SLA terms while Vendor B has stronger multi-region support. We need your technical recommendation by EOD."
        },
        {
          from: "You",
          body_hint: "Provide a technical recommendation weighing SLA vs multi-region deployment. Reference your experience with similar rollouts. Use the chunks assigned to you today."
        }
      ]
    },
    {
      id: "meet_deploy_incident",
      subject: "URGENT: Production Rollback — 5xx Errors Above Threshold",
      thread: [
        {
          from: "Ops Monitoring",
          body: "⚠️ Alert: The latest canary deployment has triggered the 1% error threshold. 5xx errors are at 2.3% and climbing. The circuit breaker is about to engage. Do we proceed with automatic rollback?"
        },
        {
          from: "You",
          body_hint: "Authorize the rollback and outline the next steps for root cause analysis. Mention the deployment pipeline safeguards. Use the chunks assigned to you today."
        }
      ]
    },
    {
      id: "meet_api_integration",
      subject: "API Gateway Integration — Rate Limiting Strategy",
      thread: [
        {
          from: "Dev Team Lead",
          body: "We're about to expose the new RESTful endpoints for the Odin service to external consumers. We need to finalize the rate limiting tiers and versioning strategy. Any preferences based on the vendor integration patterns we've seen?"
        },
        {
          from: "You",
          body_hint: "Recommend a rate limiting strategy, discuss API versioning via OpenAPI, and flag any concerns about the legacy service compatibility. Use the chunks assigned to you today."
        }
      ]
    }
  ],

  /*
   * Daily assigned chunks — used by Meeting Simulator.
   * Each day, 3 chunks are randomly selected as mandatory usage.
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
