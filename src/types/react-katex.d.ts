declare module 'react-katex' {
  import { ComponentType, ReactNode } from 'react';

  export interface KatexProps {
    math: string;
    children?: ReactNode;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    settings?: {
      displayMode?: boolean;
      throwOnError?: boolean;
      errorColor?: string;
      macros?: Record<string, string>;
      colorIsTextColor?: boolean;
      maxSize?: number;
      maxExpand?: number;
      strict?: boolean | string | ((errorCode: string) => boolean);
      trust?: boolean | ((context: { command: string; url: string; protocol: string }) => boolean);
    };
    strict?: boolean | string | ((errorCode: string) => boolean);
  }

  export const InlineMath: ComponentType<KatexProps>;
  export const BlockMath: ComponentType<KatexProps>;
  export const MathComponent: ComponentType<KatexProps>;
}