import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function CodeQuest() {
  const [status, setStatus] = useState(null);

  const checkAnswer = (correct) => {
    if (correct) {
      setStatus('correct');
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#B0E4CC', '#408A71', '#285A48', '#ffffff'],
      });
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className="card-panel" style={{ fontSize: '0.68em', textAlign: 'left' }}>
      <p style={{ marginTop: 0 }}>
        <strong>Pregunta de Depuración:</strong> Si nuestro arreglo tiene 5 elementos y todos son{' '}
        <code>[0.91f, 0.94f, 0.92f, 0.99f, 0.95f]</code>, ¿qué pasa en la línea{' '}
        <code>int idx = (int) (num * n);</code>?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
        <button className="btn-option" style={{ textAlign: 'left' }} onClick={() => checkAnswer(false)}>
          1. Lanza ArrayIndexOutOfBoundsException porque 0.99 * 5 es mayor a 5.
        </button>
        <button className="btn-option" style={{ textAlign: 'left' }} onClick={() => checkAnswer(true)}>
          2. Todos caen en buckets[4], degradando el tiempo al peor caso O(n²).
        </button>
        <button className="btn-option" style={{ textAlign: 'left' }} onClick={() => checkAnswer(false)}>
          3. El algoritmo sigue corriendo en O(n + k) sin importar dónde caigan.
        </button>
      </div>

      {status === 'correct' && (
        <p style={{ color: '#B0E4CC', marginTop: '14px', marginBottom: 0 }}>
          ¡Exacto! (int)(0.99 * 5) = 4. Todos van a la misma cubeta y Collections.sort carga con todo el arreglo.
        </p>
      )}
      {status === 'wrong' && (
        <p style={{ color: '#f59e0b', marginTop: '14px', marginBottom: 0 }}>
          ¡Revisa el cálculo! (int)(0.99 * 5) = (int)(4.95) = 4. Intenta de nuevo.
        </p>
      )}
    </div>
  );
}