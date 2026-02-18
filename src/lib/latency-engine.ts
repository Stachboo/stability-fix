export interface TestResult {
  avgPing: number;
  jitter: number;
  spikeMax: number;
  packetLoss: number;
  stabilityScore: number;
  samples: number[];
  smoothed: number[];
  hardwareGuess: 'wifi' | 'ethernet' | 'mobile';
}

export default class LatencyProcessor {
  private samples: (number | null)[] = [];
  
  // Fenêtre pour le filtre Savitzky-Golay (Niveau Master)
  private readonly WINDOW_SIZE = 5;

  reset() {
    this.samples = [];
  }

  addSample(latency: number | null) {
    this.samples.push(latency);
  }

  /**
   * Filtre de Savitzky-Golay simplifié
   * Lissage du signal sans perdre les pics de lag réels
   */
  private smoothSignal(data: number[]): number[] {
    if (data.length < this.WINDOW_SIZE) return data;
    const smoothed = [...data];
    for (let i = 2; i < data.length - 2; i++) {
      // Coefficients SG pour une fenêtre de 5 points
      smoothed[i] = (-3 * data[i - 2] + 12 * data[i - 1] + 17 * data[i] + 12 * data[i + 1] - 3 * data[i + 2]) / 35;
    }
    return smoothed.map(v => Math.max(0, v));
  }

  getResults(): TestResult {
    const validSamples = this.samples.filter((s): s is number => s !== null);
    const totalSamples = this.samples.length;
    
    if (validSamples.length === 0) {
      return { avgPing: 0, jitter: 0, spikeMax: 0, packetLoss: 100, stabilityScore: 0, samples: [], smoothed: [], hardwareGuess: 'ethernet' };
    }

    const avgPing = validSamples.reduce((a, b) => a + b, 0) / validSamples.length;
    
    // Calcul du Jitter (RFC 3550 standard)
    let jitter = 0;
    for (let i = 1; i < validSamples.length; i++) {
      jitter += Math.abs(validSamples[i] - validSamples[i - 1]);
    }
    jitter = jitter / (validSamples.length - 1);

    const spikeMax = Math.max(...validSamples);
    const packetLoss = ((totalSamples - validSamples.length) / totalSamples) * 100;

    // Lissage pour le graphique
    const smoothed = this.smoothSignal(validSamples);

    // LOGIQUE DE SCORE MIZAN (Calcul de stabilité)
    // On pénalise lourdement le Jitter et les Packet Loss
    let stabilityScore = 100 - (jitter * 2.5) - (packetLoss * 20);
    if (spikeMax > avgPing * 3) stabilityScore -= 10; // Pénalité pour spikes brutaux
    
    stabilityScore = Math.max(0, Math.min(100, Math.floor(stabilityScore)));

    return {
      avgPing,
      jitter,
      spikeMax,
      packetLoss,
      stabilityScore,
      samples: validSamples,
      smoothed,
      hardwareGuess: jitter > 5 ? 'wifi' : 'ethernet'
    };
  }
}
