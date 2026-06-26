export interface Author {
  name: string;
  affiliation: string;
  email?: string;
  isCorresponding?: boolean;
}

export interface MetricRow {
  method: string;
  cameraCondition: 'Weak' | 'No';
  psnr: number;
  ssim: number;
  lpips: number;
  isOurs?: boolean;
  isBold?: boolean;
  isUnderline?: boolean;
}

export interface DatasetMetrics {
  name: string;
  description: string;
  metrics: MetricRow[];
}

export interface ComparisonScene {
  id: string;
  name: string;
  description: string;
  zoomArea: string;
  gtImage: string; // fallback illustration or CSS-based visualization
  methods: {
    [key: string]: {
      label: string;
      psnr?: number;
      renderedColor: string; // For generating simulated graphics
      blurFactor: number;
      errorColor: string; // For error map representation
      detailLevel: number; // 0 (low) to 1 (high)
      colorShift: boolean;
      artifacts: boolean;
    };
  };
}

export interface PipelineStep {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  inputs: string[];
  outputs: string[];
  features: string[];
}
