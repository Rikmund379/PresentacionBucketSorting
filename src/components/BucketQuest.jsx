import { useState, useRef } from 'react';
import { animate } from 'animejs';
import confetti from 'canvas-confetti';

const INITIAL_ARRAY = [0.78, 0.17, 0.39, 0.26, 0.72];
const PALETTE_CONFETTI = ['#B0E4CC', '#408A71', '#285A48', '#ffffff'];

export default function BucketQuest() {
  // Fases:
  // 0: Inicio
  // 1: Dispersando 0.78 y 0.17 -> Pausa en 0.39 (Quest 1)
  // 2: Dispersión completa -> Pausa antes de ordenar cubetas (Quest 2)
  // 3: Cubetas ordenadas y arreglo final concatenado
  const [phase, setPhase] = useState(0);
  const [buckets, setBuckets] = useState([[], [], [], [], []]);
  const [placedIndices, setPlacedIndices] = useState([]);
  const [sortedResult, setSortedResult] = useState([]);
  const [feedback, setFeedback] = useState('');
  const questBoxRef = useRef(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 95,
      spread: 75,
      origin: { y: 0.65 },
      colors: PALETTE_CONFETTI,
    });
  };

  const shakeBox = () => {
    if (questBoxRef.current) {
      animate(questBoxRef.current, {
        translateX: [-10, 10, -8, 8, 0],
        duration: 380,
      });
    }
  };

  // Paso 1: Coloca 0.78 en [3] y 0.17 en [0], luego se detiene en 0.39
  const startSimulation = () => {
    setPhase(1);
    setFeedback('');
    setPlacedIndices([0]);
    setBuckets([[], [], [], [0.78], []]);

    setTimeout(() => {
      setPlacedIndices([0, 1]);
      setBuckets([[0.17], [], [], [0.78], []]);
    }, 550);
  };

  // Quest 1: ¿En qué cubeta cae 0.39? -> Respuesta: 1
  const handleBucketClick = (bucketIdx) => {
    if (phase !== 1) return;

    if (bucketIdx === 1) {
      triggerConfetti();
      setFeedback('¡Exacto! (int)(0.39 * 5) = 1. Entra a la Cubeta [1].');
      setPlacedIndices([0, 1, 2]);
      setBuckets([[0.17], [0.39], [], [0.78], []]);

      // Completa automáticamente 0.26 -> [1] y 0.72 -> [3]
      setTimeout(() => {
        setPlacedIndices([0, 1, 2, 3]);
        setBuckets([[0.17], [0.39, 0.26], [], [0.78], []]);
      }, 650);

      setTimeout(() => {
        setPlacedIndices([0, 1, 2, 3, 4]);
        setBuckets([[0.17], [0.39, 0.26], [], [0.78, 0.72], []]);
        setPhase(2);
      }, 1250);
    } else {
      setFeedback(`Cubeta [${bucketIdx}] incorrecta. Fórmula: (int)(0.39 * 5). ¡Otro intento!`);
      shakeBox();
    }
  };

  // Quest 2: Ordenar internamente cada cubeta antes de concatenar
  const handleSortAnswer = (isCorrect) => {
    if (isCorrect) {
      triggerConfetti();
      setBuckets([[0.17], [0.26, 0.39], [], [0.72, 0.78], []]);
      setSortedResult([0.17, 0.26, 0.39, 0.72, 0.78]);
      setFeedback('¡Correcto! Se ordena cada cubeta (Insertion Sort) y se concatenan en orden.');
      setPhase(3);
    } else {
      setFeedback('¡Cuidado! Recuerda que cada cubeta se ordena de menor a mayor antes de unir.');
      shakeBox();
    }
  };

  const resetAll = () => {
    setPhase(0);
    setBuckets([[], [], [], [], []]);
    setPlacedIndices([]);
    setSortedResult([]);
    setFeedback('');
  };

  return (
    <div style={{ fontSize: '0.62em', textAlign: 'center' }}>
      {/* Arreglo Original */}
      <div style={{ marginBottom: '18px' }}>
        <span style={{ color: '#408A71', display: 'block', marginBottom: '8px' }}>
          Arreglo de entrada (N = 5):
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {INITIAL_ARRAY.map((val, idx) => {
            const isPlaced = placedIndices.includes(idx);
            const isCurrentTarget = phase === 1 && idx === 2;
            return (
              <div
                key={idx}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  border: isCurrentTarget ? '2px solid #B0E4CC' : '1px solid #408A71',
                  backgroundColor: isCurrentTarget
                    ? '#408A71'
                    : isPlaced
                    ? 'rgba(40, 90, 72, 0.2)'
                    : '#285A48',
                  color: isCurrentTarget ? '#091413' : '#B0E4CC',
                  opacity: isPlaced ? 0.35 : 1,
                  transform: isCurrentTarget ? 'scale(1.12)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Cubetas */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
        {buckets.map((items, bIdx) => (
          <div
            key={bIdx}
            onClick={() => handleBucketClick(bIdx)}
            style={{
              width: '135px',
              minHeight: '115px',
              border: phase === 1 ? '2px dashed #B0E4CC' : '2px solid #408A71',
              borderRadius: '10px',
              backgroundColor: 'rgba(40, 90, 72, 0.28)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: phase === 1 ? 'pointer' : 'default',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#408A71',
                    color: '#091413',
                    fontWeight: 'bold',
                    padding: '5px',
                    borderRadius: '6px',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #285A48', paddingTop: '5px', fontSize: '0.85em' }}>
              Cubeta [{bIdx}]
            </div>
          </div>
        ))}
      </div>

      {/* Zona de Quests Interactivos */}
      <div ref={questBoxRef} className="card-panel" style={{ marginTop: '14px' }}>
        {phase === 0 && (
          <button className="btn-quest" onClick={startSimulation}>
            ▶ Ejecutar Paso 1: Dispersión
          </button>
        )}

        {phase === 1 && (
          <div>
            <p style={{ margin: '0 0 8px 0', color: '#B0E4CC' }}>
              ⏸ <strong>QUEST 1 (Para el grupo):</strong> El turno es de <strong>0.39</strong>.
              Haz clic en la cubeta correcta usando <code>(int)(valor * 5)</code>.
            </p>
          </div>
        )}

        {phase === 2 && (
          <div>
            <p style={{ margin: '0 0 12px 0' }}>
              ⏸ <strong>QUEST 2 (Ordenamiento Interno):</strong> Las cubetas [1] y [3] tienen
              colisiones. ¿Cómo quedan ordenadas antes de concatenar?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-option" onClick={() => handleSortAnswer(false)}>
                A) [0.39, 0.26] y [0.78, 0.72]
              </button>
              <button className="btn-option" onClick={() => handleSortAnswer(true)}>
                B) [0.26, 0.39] y [0.72, 0.78]
              </button>
              <button className="btn-option" onClick={() => handleSortAnswer(false)}>
                C) Se mezclan todas al azar
              </button>
            </div>
          </div>
        )}

        {phase === 3 && (
          <div>
            <p style={{ margin: '0 0 10px 0', color: '#408A71' }}>
              Arreglo Final Concatenado (Ordenado):
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
              {sortedResult.map((num, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#B0E4CC',
                    color: '#091413',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                  }}
                >
                  {num}
                </span>
              ))}
            </div>
            <button className="btn-option" onClick={resetAll}>
              ↻ Reiniciar Simulador
            </button>
          </div>
        )}

        {feedback && (
          <p style={{ marginTop: '10px', marginBottom: 0, color: '#B0E4CC' }}>{feedback}</p>
        )}
      </div>
    </div>
  );
}