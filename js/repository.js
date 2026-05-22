/*
 * repository.js — Adaptive Difficulty Chunk Database
 *
 * Technical Business English chunks with difficulty levels 1-4.
 * Level 1 = Beginner (simple phrases, common words)
 * Level 2 = Intermediate (standard technical, compound sentences)
 * Level 3 = Advanced (complex technical, nuanced expressions)
 * Level 4 = Expert (industry-specific, subtle distinctions, formal)
 *
 * Each chunk includes `critical_phoneme` for shadowing.
 */

const REPOSITORY = {
  chunks: [
    // ============================================================
    // LEVEL 1 — Beginner (Simple, everyday technical)
    // ============================================================
    {
      id: "l1_intro_01",
      category: "presentation",
      difficulty: 1,
      spanish: "Hola, soy el responsable técnico del proyecto.",
      english: "Hi, I am the technical lead for this project.",
      critical_phoneme: "technical lead / project"
    },
    {
      id: "l1_intro_02",
      category: "presentation",
      difficulty: 1,
      spanish: "Trabajo en el equipo de infraestructura.",
      english: "I work on the infrastructure team.",
      critical_phoneme: "infrastructure team"
    },
    {
      id: "l1_intro_03",
      category: "presentation",
      difficulty: 1,
      spanish: "Voy a presentar el plan para este mes.",
      english: "I will present the plan for this month.",
      critical_phoneme: "present / plan / month"
    },
    {
      id: "l1_intro_04",
      category: "presentation",
      difficulty: 1,
      spanish: "¿Puedes repetir eso, por favor?",
      english: "Can you repeat that, please?",
      critical_phoneme: "repeat / please"
    },
    {
      id: "l1_meeting_01",
      category: "presentation",
      difficulty: 1,
      spanish: "La reunión empieza a las diez.",
      english: "The meeting starts at ten.",
      critical_phoneme: "meeting starts / ten"
    },
    {
      id: "l1_meeting_02",
      category: "presentation",
      difficulty: 1,
      spanish: "Estoy de acuerdo con esa propuesta.",
      english: "I agree with that proposal.",
      critical_phoneme: "agree / proposal"
    },
    {
      id: "l1_vendor_01",
      category: "rfp_vendors",
      difficulty: 1,
      spanish: "El proveedor envió un email ayer.",
      english: "The vendor sent an email yesterday.",
      critical_phoneme: "vendor / sent / email"
    },
    {
      id: "l1_vendor_02",
      category: "rfp_vendors",
      difficulty: 1,
      spanish: "Necesitamos un precio mejor.",
      english: "We need a better price.",
      critical_phoneme: "need / better price"
    },
    {
      id: "l1_system_01",
      category: "odin_service",
      difficulty: 1,
      spanish: "El sistema no funciona bien hoy.",
      english: "The system is not working well today.",
      critical_phoneme: "system / working / today"
    },
    {
      id: "l1_system_02",
      category: "odin_service",
      difficulty: 1,
      spanish: "Vamos a revisar el problema mañana.",
      english: "We will review the issue tomorrow.",
      critical_phoneme: "review / issue / tomorrow"
    },
    {
      id: "l1_api_01",
      category: "api",
      difficulty: 1,
      spanish: "La API devuelve un error.",
      english: "The API returns an error.",
      critical_phoneme: "API / returns / error"
    },
    {
      id: "l1_deploy_01",
      category: "deployment",
      difficulty: 1,
      spanish: "El despliegue está listo.",
      english: "The deployment is ready.",
      critical_phoneme: "deployment / ready"
    },

    // ============================================================
    // LEVEL 2 — Intermediate (Standard technical terms)
    // ============================================================
    {
      id: "l2_intro_01",
      category: "presentation",
      difficulty: 2,
      spanish: "Soy el arquitecto de soluciones del equipo cloud.",
      english: "I am the solutions architect on the cloud team.",
      critical_phoneme: "solutions architect / cloud"
    },
    {
      id: "l2_intro_02",
      category: "presentation",
      difficulty: 2,
      spanish: "Voy a repasar los objetivos del sprint.",
      english: "I will review the sprint objectives.",
      critical_phoneme: "review / sprint objectives"
    },
    {
      id: "l2_intro_03",
      category: "presentation",
      difficulty: 2,
      spanish: "¿Podemos agendar una llamada para la semana que viene?",
      english: "Can we schedule a call for next week?",
      critical_phoneme: "schedule / call / next week"
    },
    {
      id: "l2_rfp_01",
      category: "rfp_vendors",
      difficulty: 2,
      spanish: "¿Esta función está incluida o cuesta extra?",
      english: "Is this feature included or does it cost extra?",
      critical_phoneme: "feature / included / extra"
    },
    {
      id: "l2_rfp_02",
      category: "rfp_vendors",
      difficulty: 2,
      spanish: "El proveedor ofrece buenos precios.",
      english: "The vendor offers good prices.",
      critical_phoneme: "vendor / offers / prices"
    },
    {
      id: "l2_odin_01",
      category: "odin_service",
      difficulty: 2,
      spanish: "Odin es nuestro sistema principal de automatización.",
      english: "Odin is our main automation system.",
      critical_phoneme: "main automation / system"
    },
    {
      id: "l2_infra_01",
      category: "infrastructure",
      difficulty: 2,
      spanish: "Los servidores están en tres zonas diferentes.",
      english: "The servers are in three different zones.",
      critical_phoneme: "servers / different zones"
    },
    {
      id: "l2_infra_02",
      category: "infrastructure",
      difficulty: 2,
      spanish: "Necesitamos más capacidad en la base de datos.",
      english: "We need more capacity in the database.",
      critical_phoneme: "capacity / database"
    },
    {
      id: "l2_api_01",
      category: "api",
      difficulty: 2,
      spanish: "La API gestiona el acceso de usuarios.",
      english: "The API manages user access.",
      critical_phoneme: "manages / user access"
    },
    {
      id: "l2_api_02",
      category: "api",
      difficulty: 2,
      spanish: "Exponemos datos en tiempo real.",
      english: "We expose data in real time.",
      critical_phoneme: "expose / real time"
    },
    {
      id: "l2_deploy_01",
      category: "deployment",
      difficulty: 2,
      spanish: "El pipeline ejecuta tests automáticos.",
      english: "The pipeline runs automated tests.",
      critical_phoneme: "pipeline / automated tests"
    },
    {
      id: "l2_deploy_02",
      category: "deployment",
      difficulty: 2,
      spanish: "Hacemos despliegues pequeños cada día.",
      english: "We do small deployments every day.",
      critical_phoneme: "small deployments / every day"
    },
    {
      id: "l2_tshoot_01",
      category: "troubleshooting",
      difficulty: 2,
      spanish: "Los logs muestran errores desde las dos.",
      english: "The logs show errors since two o'clock.",
      critical_phoneme: "logs / show errors"
    },
    {
      id: "l2_tshoot_02",
      category: "troubleshooting",
      difficulty: 2,
      spanish: "Encontré el problema en la conexión.",
      english: "I found the issue in the connection.",
      critical_phoneme: "found / issue / connection"
    },

    // ============================================================
    // LEVEL 3 — Advanced (Complex technical, nuanced)
    // ============================================================
    {
      id: "l3_intro_01",
      category: "presentation",
      difficulty: 3,
      spanish: "Permítanme presentarles la hoja de ruta técnica para el próximo trimestre.",
      english: "Let me walk you through the technical roadmap for the next quarter.",
      critical_phoneme: "walk you through / roadmap"
    },
    {
      id: "l3_intro_02",
      category: "presentation",
      difficulty: 3,
      spanish: "Me gustaría resumir los hitos clave que alcanzamos en el sprint anterior.",
      english: "I'd like to recap the key milestones we hit in the previous sprint.",
      critical_phoneme: "recap / milestones / sprint"
    },
    {
      id: "l3_rfp_01",
      category: "rfp_vendors",
      difficulty: 3,
      spanish: "¿Esta característica está soportada de forma nativa o requiere desarrollo a medida?",
      english: "Is this feature supported out of the box or does it require custom development?",
      critical_phoneme: "feature / out of the box"
    },
    {
      id: "l3_rfp_02",
      category: "rfp_vendors",
      difficulty: 3,
      spanish: "Hemos revisado tres RFPs y este proveedor ofrece la mejor relación costo-beneficio.",
      english: "We've reviewed three RFPs and this vendor offers the best cost-benefit ratio.",
      critical_phoneme: "RFPs / vendor / cost-benefit"
    },
    {
      id: "l3_vendor_01",
      category: "rfp_vendors",
      difficulty: 3,
      spanish: "El SLA actual no cubre tiempos de respuesta inferiores a 4 horas. Hay que renegociarlo.",
      english: "The current SLA doesn't cover response times under 4 hours. We need to renegotiate it.",
      critical_phoneme: "SLA / response times / renegotiate"
    },
    {
      id: "l3_vendor_02",
      category: "rfp_vendors",
      difficulty: 3,
      spanish: "Pregúntales si soportan despliegues multi-región con failover automático.",
      english: "Ask them if they support multi-region deployments with automatic failover.",
      critical_phoneme: "multi-region / deployments / failover"
    },
    {
      id: "l3_odin_01",
      category: "odin_service",
      difficulty: 3,
      spanish: "La infraestructura core de Odin corre sobre Kubernetes con auto-scaling.",
      english: "Odin's core infrastructure runs on Kubernetes with auto-scaling.",
      critical_phoneme: "core infrastructure / Kubernetes / auto-scaling"
    },
    {
      id: "l3_odin_02",
      category: "odin_service",
      difficulty: 3,
      spanish: "Migraremos los microservicios legacy a una arquitectura orientada a eventos.",
      english: "We'll migrate the legacy microservices to an event-driven architecture.",
      critical_phoneme: "legacy / event-driven architecture"
    },
    {
      id: "l3_infra_01",
      category: "infrastructure",
      difficulty: 3,
      spanish: "El balanceador de carga distribuye el tráfico entre tres zonas de disponibilidad.",
      english: "The load balancer distributes traffic across three availability zones.",
      critical_phoneme: "load balancer / availability zones"
    },
    {
      id: "l3_infra_02",
      category: "infrastructure",
      difficulty: 3,
      spanish: "Implementamos circuit breakers para evitar fallos en cascada entre servicios.",
      english: "We implemented circuit breakers to prevent cascading failures across services.",
      critical_phoneme: "circuit breakers / cascading failures"
    },
    {
      id: "l3_api_01",
      category: "api",
      difficulty: 3,
      spanish: "La API gateway gestiona autenticación, rate limiting y versionado.",
      english: "The API gateway handles authentication, rate limiting, and versioning.",
      critical_phoneme: "API gateway / rate limiting / versioning"
    },
    {
      id: "l3_api_02",
      category: "api",
      difficulty: 3,
      spanish: "Documentamos todos los endpoints con OpenAPI 3.0 para que los consumidores generen sus SDKs.",
      english: "We document all endpoints with OpenAPI 3.0 so consumers can generate their SDKs.",
      critical_phoneme: "endpoints / OpenAPI / SDKs"
    },
    {
      id: "l3_deploy_01",
      category: "deployment",
      difficulty: 3,
      spanish: "Hacemos despliegues canary para validar cada release con un 5% del tráfico real.",
      english: "We use canary deployments to validate each release with 5% of live traffic.",
      critical_phoneme: "canary deployments / live traffic"
    },
    {
      id: "l3_deploy_02",
      category: "deployment",
      difficulty: 3,
      spanish: "El rollback es instantáneo si los errores 5xx superan el umbral del 1%.",
      english: "The rollback is instant if 5xx errors exceed the 1% threshold.",
      critical_phoneme: "rollback / errors / threshold"
    },
    {
      id: "l3_tshoot_01",
      category: "troubleshooting",
      difficulty: 3,
      spanish: "Los logs muestran timeouts intermitentes entre el frontend y el backend desde las 14:00.",
      english: "The logs show intermittent timeouts between the frontend and the backend since 2 PM.",
      critical_phoneme: "intermittent timeouts"
    },
    {
      id: "l3_tshoot_02",
      category: "troubleshooting",
      difficulty: 3,
      spanish: "Aislé el problema: es una fuga de conexiones en el pool de base de datos.",
      english: "I've isolated the issue: it's a connection leak in the database pool.",
      critical_phoneme: "isolated / connection leak / pool"
    },

    // ============================================================
    // LEVEL 4 — Expert (Industry-specific, subtle, very formal)
    // ============================================================
    {
      id: "l4_intro_01",
      category: "presentation",
      difficulty: 4,
      spanish: "Permítanme exponer la estrategia de desacoplamiento progresivo de los servicios críticos.",
      english: "Allow me to outline the progressive decoupling strategy for the critical services.",
      critical_phoneme: "outline / progressive decoupling / critical"
    },
    {
      id: "l4_rfp_01",
      category: "rfp_vendors",
      difficulty: 4,
      spanish: "El pliego de condiciones exige cumplimiento con ISO 27001 y SOC 2 Type II.",
      english: "The request for proposal mandates ISO 27001 and SOC 2 Type II compliance.",
      critical_phoneme: "request for proposal / mandates / compliance"
    },
    {
      id: "l4_rfp_02",
      category: "rfp_vendors",
      difficulty: 4,
      spanish: "Tenemos que evaluar si el proveedor puede escalar a diez mil usuarios concurrentes sin degradación del servicio.",
      english: "We need to assess whether the vendor can scale to ten thousand concurrent users without service degradation.",
      critical_phoneme: "assess / scale / concurrent / degradation"
    },
    {
      id: "l4_vendor_01",
      category: "rfp_vendors",
      difficulty: 4,
      spanish: "El proveedor asegura que la migración se completará con cero pérdida de datos y mínimo tiempo de inactividad.",
      english: "The vendor guarantees that the migration will be completed with zero data loss and minimal downtime.",
      critical_phoneme: "guarantees / zero data loss / minimal downtime"
    },
    {
      id: "l4_blocker_01",
      category: "rfp_vendors",
      difficulty: 4,
      spanish: "Necesitamos revisar la documentación de arquitectura porque esto constituye un bloqueador para el release.",
      english: "We need to review the architecture documentation because this constitutes a blocker for the release.",
      critical_phoneme: "constitutes / blocker / release"
    },
    {
      id: "l4_odin_01",
      category: "odin_service",
      difficulty: 4,
      spanish: "Odin es nuestro servicio central para la automatización de infraestructura. Actualmente estamos desacoplando sus componentes acoplados.",
      english: "Odin is our core service for infrastructure automation. We are currently decoupling its tightly-coupled components.",
      critical_phoneme: "core service / tightly-coupled / components"
    },
    {
      id: "l4_api_01",
      category: "api",
      difficulty: 4,
      spanish: "Expusimos un endpoint RESTful que devuelve el estado del despliegue en tiempo real con granularidad a nivel de pod.",
      english: "We exposed a RESTful endpoint that returns the deployment status in real time with pod-level granularity.",
      critical_phoneme: "exposed / RESTful / pod-level granularity"
    },
    {
      id: "l4_api_02",
      category: "api",
      difficulty: 4,
      spanish: "La integración entre servicios usa colas de mensajería con RabbitMQ para garantizar entrega eventual.",
      english: "The service-to-service integration uses message queues with RabbitMQ to guarantee eventual delivery.",
      critical_phoneme: "service-to-service / eventual delivery"
    },
    {
      id: "l4_deploy_01",
      category: "deployment",
      difficulty: 4,
      spanish: "El pipeline de CI/CD ejecuta tests unitarios, de integración, escaneo de seguridad y análisis estático de calidad.",
      english: "The CI/CD pipeline runs unit tests, integration tests, security scanning, and static quality analysis.",
      critical_phoneme: "security scanning / static quality analysis"
    },
    {
      id: "l4_deploy_02",
      category: "deployment",
      difficulty: 4,
      spanish: "Programamos las ventanas de mantenimiento los domingos a las 3 AM UTC para minimizar impacto en zonas horarias globales.",
      english: "We schedule maintenance windows on Sundays at 3 AM UTC to minimize impact across global time zones.",
      critical_phoneme: "maintenance windows / global time zones"
    },
    {
      id: "l4_tshoot_01",
      category: "troubleshooting",
      difficulty: 4,
      spanish: "Escalamos el incidente al equipo de operaciones porque afecta a producción y tiene visibilidad ejecutiva.",
      english: "We've escalated the incident to the operations team because it's affecting production and has executive visibility.",
      critical_phoneme: "escalated / executive visibility"
    },
    {
      id: "l4_tshoot_02",
      category: "troubleshooting",
      difficulty: 4,
      spanish: "La causa raíz fue un cambio de configuración que no pasó por revisión de pares ni por pipeline de validación.",
      english: "The root cause was a configuration change that didn't go through peer review or the validation pipeline.",
      critical_phoneme: "root cause / peer review / validation pipeline"
    }
  ],

  /*
   * Meeting Simulator — prompt/email thread templates.
   * Difficulty 1-2 = simpler threads, 3-4 = complex threads.
   */
  meetingTemplates: [
    {
      id: "meet_simple_checkin",
      difficulty: 1,
      subject: "Weekly Check-in — Project Status",
      thread: [
        {
          from: "Project Manager",
          body: "Hi team, quick check-in. How is the deployment going? Are we on track for this week?"
        },
        {
          from: "You",
          body_hint: "Respond with a brief status update. Mention if there are any blockers. Use simple language."
        }
      ]
    },
    {
      id: "meet_vendor_simple",
      difficulty: 1,
      subject: "Vendor Price Question",
      thread: [
        {
          from: "Vendor Sales",
          body: "Hello, we received your request. Could you tell us how many users you expect? This helps us with pricing."
        },
        {
          from: "You",
          body_hint: "Ask about included features and request a better price. Keep it simple."
        }
      ]
    },
    {
      id: "meet_rfp_intermediate",
      difficulty: 2,
      subject: "RFP Questions — Technical Requirements",
      thread: [
        {
          from: "Procurement Team",
          body: "We need your input on the RFP. Do we require custom development for the reporting module, or is it included?"
        },
        {
          from: "You",
          body_hint: "Explain that some features are included but reporting might need custom work. Be specific."
        }
      ]
    },
    {
      id: "meet_deploy_issue",
      difficulty: 2,
      subject: "Deployment Issue — Tests Failing",
      thread: [
        {
          from: "DevOps Engineer",
          body: "The pipeline failed on the integration tests step. The logs show a connection timeout to the test database. Should we retry or investigate further?"
        },
        {
          from: "You",
          body_hint: "Recommend investigating the connection pool settings before retrying. Mention the test environment."
        }
      ]
    },
    {
      id: "meet_vendor_inquiry",
      difficulty: 3,
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
      difficulty: 3,
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
      difficulty: 3,
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
      difficulty: 3,
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
    },
    {
      id: "meet_exec_review",
      difficulty: 4,
      subject: "Executive Review — Q3 Infrastructure Roadmap",
      thread: [
        {
          from: "CTO",
          body: "The board wants a detailed breakdown of our infrastructure decoupling strategy. Specifically: (1) timeline for complete service isolation, (2) risk mitigation for zero-downtime migration, (3) cost projection for multi-region failover. Please prepare a concise executive summary with go/no-go criteria."
        },
        {
          from: "You",
          body_hint: "Provide a structured executive response. Cover the three points with specific timelines, risk strategies, and cost frameworks. Use formal language and the chunks assigned today."
        }
      ]
    },
    {
      id: "meet_security_audit",
      difficulty: 4,
      subject: "Security Audit Findings — Compliance Gap Analysis",
      thread: [
        {
          from: "Security Auditor",
          body: "Our audit identified gaps in the current access control model. The API gateway lacks granular RBAC, and the CI/CD pipeline doesn't enforce signed commits. We need a remediation plan with SOC 2 compliance milestones within 90 days. What's your proposed approach?"
        },
        {
          from: "You",
          body_hint: "Acknowledge the findings, propose a phased remediation plan with specific milestones, and emphasize the validation pipeline improvements. Use formal technical language."
        }
      ]
    }
  ],

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
