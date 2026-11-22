import { useEffect, useRef } from 'react';
import { Deck, Slide } from '@revealjs/react';
import Highlight from 'reveal.js/plugin/highlight';
import { animate } from 'animejs';
import BucketQuest from './components/BucketQuest';
import CodeQuest from './components/CodeQuest';


const JAVA_DEBUG_CODE = `public static void bucketSort(float[] arr) {
    int n = arr.length;
    // 1. Inicializar N cubetas vacías en memoria
    List<Float>[] buckets = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        buckets[i] = new ArrayList<>();
    }

    // 2. Dispersión: calcular índice y repartir
    for (float num : arr) {
        int idx = (int) (num * n); // Ej: 0.39 * 5 = 1
        buckets[idx].add(num);
    }

    // 3. Ordenar individualmente cada cubeta
    for (List<Float> bucket : buckets) {
        Collections.sort(bucket);
    }

    // 4. Fusión: devolver elementos al arreglo original
    int pos = 0;
    for (List<Float> bucket : buckets) {
        for (float num : bucket) arr[pos++] = num;
    }
}`;

export default function App() {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      animate(titleRef.current, {
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 900,
        ease: 'outExpo',
      });
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Deck
        plugins={[Highlight]}
        config={{
          hash: true,
          slideNumber: 'c/t',
          transition: 'slide',
          controlsTutorial: false,
        }}
      >
        {/* SLIDE 1: Portada */}
        <Slide>
          <div ref={titleRef}>
            <p style={{ color: '#408A71', fontSize: '0.6em', letterSpacing: '0.2em' }}>
              ESTRUCTURAS DE DATOS • ORDENAMIENTO
            </p>
            <h1 style={{ fontSize: '2.4em', margin: '10px 0' }}>BUCKET SORT</h1>
            <p style={{ fontSize: '0.85em', color: '#B0E4CC' }}>
              Divide, reparte en cubetas y ordena en tiempo lineal
            </p>
          </div>
        </Slide>

        {/* SLIDE 2: Contexto, qué datos ordena y cuándo usarlo */}
        <Slide>
          <h2>¿Qué es y qué datos ordena?</h2>
          <div className="card-panel" style={{ fontSize: '0.72em', textAlign: 'left', lineHeight: 1.6 }}>
            <p className="fragment">
              <strong style={{ color: '#408A71' }}>Idea central:</strong> En lugar de comparar todos
              contra todos desde el inicio, divide el rango de datos en <strong>N cubetas</strong>,
              ordena cada cubeta por separado y las une.
            </p>
            <p className="fragment">
              <strong style={{ color: '#408A71' }}>¿Qué datos ordena mejor?</strong> Números
              decimales (<code>float</code> / <code>double</code>) distribuidos{' '}
              <strong>uniformemente</strong> en <code>[0.0, 1.0)</code>, o enteros escalados por su
              valor máximo.
            </p>
            <p className="fragment" style={{ marginBottom: 0 }}>
              <strong style={{ color: '#408A71' }}>Uso real:</strong> Histogramas de color en
              procesamiento de imágenes, calificaciones normalizadas y ordenamiento externo de
              archivos grandes.
            </p>
          </div>
        </Slide>

        {/* SLIDE 3: Simulación Interactiva + Quests 1 y 2 */}
        <Slide>
          <h2 style={{ marginBottom: '10px' }}>Simulación en Vivo</h2>
          <BucketQuest />
        </Slide>

        {/* SLIDE 4: Código Java en Modo Debugger */}
        <Slide>
          <h2>Java: Paso a Paso (Modo Debugger)</h2>
          <p style={{ fontSize: '0.55em', color: '#408A71', margin: '0 0 10px 0' }}>
            Avanza con la flecha → para inspeccionar cada bloque de ejecución
          </p>
          <pre style={{ fontSize: '0.52em', border: '1px solid #408A71', borderRadius: '10px' }}>
            <code
              className="language-java"
              data-trim
              data-noescape
              data-line-numbers="1-7|9-13|15-18|20-24"
            >
              {JAVA_DEBUG_CODE}
            </code>
          </pre>
        </Slide>

        {/* SLIDE 5: Quest de Código */}
        <Slide>
          <h2>Quest de Depuración</h2>
          <CodeQuest />
        </Slide>

        {/* SLIDE 6: Lo bueno, lo malo y lo mejor */}
        <Slide>
          <h2>Lo Bueno, Lo Malo y Lo Mejor</h2>
          <table style={{ fontSize: '0.62em' }}>
            <thead>
              <tr>
                <th>Evaluación</th>
                <th>Complejidad</th>
                <th>¿Por qué ocurre?</th>
              </tr>
            </thead>
            <tbody>
              <tr className="fragment">
                <td style={{ color: '#B0E4CC' }}>
                  <strong>Lo Mejor / Promedio</strong>
                </td>
                <td>
                  <code>O(n + k)</code>
                </td>
                <td>Datos uniformes: cada cubeta recibe 1 o 2 elementos.</td>
              </tr>
              <tr className="fragment">
                <td style={{ color: '#408A71' }}>
                  <strong>Lo Bueno</strong>
                </td>
                <td>Paralelizable</td>
                <td>Cada cubeta es independiente y puede ordenarse en hilos distintos.</td>
              </tr>
              <tr className="fragment">
                <td style={{ color: '#f59e0b' }}>
                  <strong>Lo Malo (Peor Caso)</strong>
                </td>
                <td>
                  <code>O(n²)</code> + RAM
                </td>
                <td>Si todos los datos caen en una sola cubeta + memoria extra de listas.</td>
              </tr>
            </tbody>
          </table>
        </Slide>

        {/* SLIDE 7: Cierre */}
        <Slide>
          <h2>Resumen en 10 Segundos</h2>
          <div className="card-panel" style={{ fontSize: '0.75em' }}>
            <p>1. Dispersa con <code>(int)(num * n)</code></p>
            <p>2. Ordena cada cubeta pequeña</p>
            <p>3. Concatena y listo: <code>O(n + k)</code></p>
          </div>
          <p style={{ fontSize: '0.55em', color: '#408A71', marginTop: '20px' }}>
            Código fuente abierto bajo licencia MIT • GitHub: Rikmund379
          </p>
        </Slide>
      </Deck>
    </div>
  );
}