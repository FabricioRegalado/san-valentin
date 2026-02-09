import { useMemo, useState, useEffect } from "react";

function HeartGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-rose-400/10 blur-3xl" />
    </div>
  );
}

function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generar corazones aleatorios con diferentes tamaños, colores y trayectorias
    const newHearts = Array.from({ length: 36 }).map((_, i) => {
      const size = 1.8 + Math.random() * 3.2; 
      const colors = ["❤️", "🩷", "🌹"];
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 6 + Math.random() * 3,
        xOffset: Math.random() * 120 - 60,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    setHearts(newHearts);

    // Limpiar después de la animación
    const timer = setTimeout(() => setHearts([]), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0">
      <style>{`
        @keyframes floatExplosion {
          0% {
            opacity: 1;
            transform: translate3d(var(--x), 0, 0) scale(0.6);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--x), -150vh, 0) scale(0.15);
          }
        }
      `}</style>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            top: "100%",
            fontSize: `${64 * heart.size}px`,
            animation: `floatExplosion ${heart.duration}s ease-in-out forwards`,
            animationDelay: `${heart.delay}s`,
            filter: "drop-shadow(0 0 12px rgba(236, 72, 153, 0.7))",
            willChange: "transform, opacity",
            "--x": `${heart.xOffset}px`,
          }}
        >
          {heart.color}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("ask"); // ask | yes | no 
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [showHearts, setShowHearts] = useState(false);

  const name = "cielito";
  const question = `¿Quieres ser mi San Valentín, ${name}?`;
  const yesMsg = `Perfecto, ${name}. Tenemos una cita\neste 14 ❤️‍🩹🥺`;
  const noMsg = `Ok… (pero te dejo pensarlo)`;

  const moveNo = () => {
    // movimiento suave dentro de un rango
    const x = Math.floor((Math.random() * 2 - 1) * 120);
    const y = Math.floor((Math.random() * 2 - 1) * 60);
    setNoPos({ x, y });
  };

  const subtitle = useMemo(() => {
    if (step === "ask") return "Una sola pregunta. Prometo que vale la pena.";
    if (step === "yes") return "Ya quedó. No hay devoluciones.";
    return "Te doy otra oportunidad…";
  }, [step]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {showHearts && <FloatingHearts />}
      <div className="mx-auto flex min-h-screen max-w-md items-center px-5">
        <div className="relative w-full">
          <HeartGlow />

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="mb-5">
             

              <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                {step === "ask" ? question : step === "yes" ? "¡Dijo que sí!" : "¿Seguro?"}
              </h1>
              <p className="mt-2 text-sm text-white/70">{subtitle}</p>
            </div>

            {/* Body */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-5">
              {step === "ask" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    <div className="flex items-center justify-between">
                      <span>Elegir una opción:</span>
                    </div>
                  </div>

                  <div className="relative flex gap-3">
                    <button
                      onClick={() => {
                        setShowHearts(true);
                        setStep("yes");
                      }}
                      className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold shadow-lg shadow-pink-500/20 transition duration-300 hover:scale-[1.05] hover:shadow-xl hover:shadow-pink-500/40 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
                    >
                      Sí, obvio
                    </button>

                    <div
                      className="flex-1"
                      style={{
                        transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                        transition: "transform 220ms ease",
                      }}
                    >
                      <button
                        onMouseEnter={moveNo}
                        onTouchStart={moveNo}
                        onClick={() => setStep("no")}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 transition duration-300 hover:bg-white/20 hover:border-white/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                        title="piénsalo bien"
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-white/55">
                    Tip: el "No" es tímido. Tocalo con tu dedito.
                  </p>
                </div>
              )}

              {step === "yes" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 text-center whitespace-pre-line">
                    {yesMsg}
                  </div>

                  <button
                    onClick={() => setStep("ask")}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition duration-300 hover:bg-white/20 hover:border-white/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    Reiniciar
                  </button>
                </div>
              )}

              {step === "no" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    {noMsg}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("ask")}
                      className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold shadow-lg shadow-pink-500/20 transition duration-300 hover:scale-[1.05] hover:shadow-xl hover:shadow-pink-500/40 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
                    >
                      Ok, otra vez
                    </button>
                    <button
                      onClick={() => setStep("yes")}
                      className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition duration-300 hover:bg-white/20 hover:border-white/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      Cambié de opinión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between text-xs text-white/50">
              <span>Hecho con amor, corazon de melon 🍈❤️‍🩹</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
