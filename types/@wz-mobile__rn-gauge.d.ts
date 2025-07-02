// @wz-mobile__rn-gauge.d.ts
declare module '@wz-mobile/rn-gauge' {
    import { ReactNode } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
  
    export interface GaugeProps {
      size: number;
      thickness?: number;
      colors: string[];
      steps?: number[];
      emptyColor: string;
      fillProgress: number;
      sweepAngle: number;
      strokeWidth?: number;
      renderLabel: () => ReactNode;
      renderNeedle?: (params: { getNeedleStyle: any }) => ReactNode;
      canvasStyle?: StyleProp<ViewStyle>;
      shadowProps?: any;
      springConfig?: any;
      showGaugeCenter?: boolean;
    }
  
    export const Gauge: React.FC<GaugeProps>;
  }
  