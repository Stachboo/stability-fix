/**
 * LATENCY ENGINE v3.0 (Hardcore Gamer Edition)
 * Moteur mathématique sévère pour l'analyse de stabilité.
 */

export interface PingSample {
  id: number;
  value: number; // ms
  timestamp: number;
}

export interface TestResult {
  avgPing: number;        // Moyenne simple
  jitter: number;         // Variation moyenne
  spikeMax: number;       // Le pire lag enregistré
  packetLoss: number;     // Pourcentage %
  stabilityScore: number; // Score 0-100 (Sévère)
  samples: number[];      // Données brutes
  smoothed: number[];     // Données lissées (SG Filter)
  hardwareGuess: 'ethernet' | 'wifi' | 'cellular'; // Estimation
}

export class LatencyProcessor {
  private samples: number[] = [];
  private totalAttempts: number = 0;
  private lostPackets: number = 0;
  
  // Coefficients Savitzky-Golay (Window 5, Quadratic)
  // Ne pas toucher : c'est le standard mathématique pour le lissage de courbes
  private readonly sgCoefficients = [-3, 12, 17, 12, -3];
  private readonly sgDivisor = 35;

  constructor() {}

  public addSample(latencyms: number | null): void {
    this.totalAttempts++;
    if (latencyms === null) {
      this.lostPackets++;
    } else {
      // On ignore les valeurs aberrantes > 2000ms (timeout pur)
      if (latencyms >= 0 && latencyms < 2000) {
        this.samples.push(latencyms);
      }
    }
  }

  private applySavitzkyGolay(data: number[]): number[] {
    if (data.length < 5) return data; 

    const result: number[] = [];
    const halfWindow = 2; 

    for (let i = 0; i < data.length; i++) {
      if (i < halfWindow || i >= data.length - halfWindow) {
        result.push(data[i]);
        continue;
      }
      let sum = 0;
      for (let j = -halfWindow; j <= halfWindow; j++) {
        const coeffIndex = j + halfWindow; 
        sum += data[i + j] * this.sgCoefficients[coeffIndex];
      }
      result.push(Math.max(0, sum / this.sgDivisor));
    }
    return result;
  }

  private calculateJitter(data: number[]): number {
    if (data.length < 2) return 0;
    let totalDiff = 0;
    for (let i = 1; i < data.length; i++) {
      totalDiff += Math.abs(data[i] - data[i - 1]);
    }
    return totalDiff / (data.length - 1);
  }

  private guessHardware(jitter: number, spikeMax: number): 'ethernet' | 'wifi' | 'cellular' {
    if (jitter < 2.5 && spikeMax < 25) return 'ethernet'; 
    if (jitter > 10 || spikeMax > 120) return 'cellular'; 
    return 'wifi'; 
  }

  public getResults(): TestResult {
    const validSamples = this.samples.length;
    const sum = this.samples.reduce((a, b) => a + b, 0);
    const avgPing = validSamples > 0 ? sum / validSamples : 0;
    const spikeMax = validSamples > 0 ? Math.max(...this.samples) : 0;
    
    const packetLoss = this.totalAttempts > 0 
      ? (this.lostPackets / this.totalAttempts) * 100 
      : 0;

    const jitter = this.calculateJitter(this.samples);
    const smoothed = this.applySavitzkyGolay(this.samples);

    // --- CALCUL DU SCORE (MODE HARDCORE - REALITY CHECK) ---
    let score = 100;

    // 1. Pénalité Jitter : Multiplicateur x5
    // Exemple : 7.8ms * 5 = -39 points (Le score tombe direct à 61/100)
    score -= (jitter * 5); 

    // 2. Pénalité Packet Loss : Punitive
    // 1% de perte = -25 points. Le gaming ne tolère aucune perte.
    score -= (packetLoss * 25);

    // 3. Pénalité Ping : Tolérante
    // On ne punit que si le ping de base dépasse 30ms
    if (avgPing > 30) score -= ((avgPing - 30) / 5);

    // Bornage strict 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      avgPing: Number(avgPing.toFixed(1)),
      jitter: Number(jitter.toFixed(1)),
      spikeMax: Number(spikeMax.toFixed(0)),
      packetLoss: Number(packetLoss.toFixed(1)),
      stabilityScore: Number(score.toFixed(0)),
      samples: this.samples,
      smoothed: smoothed,
      hardwareGuess: this.guessHardware(jitter, spikeMax)
    };
  }

  public reset(): void {
    this.samples = [];
    this.totalAttempts = 0;
    this.lostPackets = 0;
  }
}
