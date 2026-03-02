import { runCouncil } from "../src/lib/orchestrator";

// Pequeño script para probar que nuestro OllamaClient y System Prompts 
// funcionan juntos sin depender de la UI de Next.js.

async function test() {
  console.log("====================================================");
  console.log("🚀 INICIANDO PRUEBA DE ORQUESTADOR (FASE 4)");
  console.log("====================================================");

  const topic = "Una herramienta CLI para gestionar bases de datos SQLite locales";

  await runCouncil(topic, {}, {
    onAgentStart: (agent) => {
      console.log(`\n\n>>> 🤖 [${agent.toUpperCase()}] ha comenzado a pensar...`);
    },
    onAgentChunk: (agent, chunk) => {
      // Imprimimos el texto tal como llega (efecto máquina de escribir)
      process.stdout.write(chunk);
    },
    onAgentDone: (agent) => {
      console.log(`\n<<< 🏁 [${agent.toUpperCase()}] ha terminado su turno.`);
    },
    onCouncilComplete: (finalIdea) => {
      console.log("\n\n####################################################");
      console.log("🎊 EL CONSEJO HA LLEGADO A UN VEREDICTO FINAL");
      console.log("####################################################\n");
    },
    onError: (error) => {
      console.error(`\n\n❌ Ocurrió un error en el Orquestador:`, error);
    }
  });
}

test();
