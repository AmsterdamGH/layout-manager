export interface Iframe {
  id: string;
  url: string;
  title: string;
  isVisible: boolean;
  width: number;
  height: number;
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
}
