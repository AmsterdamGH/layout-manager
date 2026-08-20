import { ReactNode, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  text: string;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ text, children, placement = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentPlacement, setCurrentPlacement] = useState<TooltipProps['placement']>(placement);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const result = calculateTooltipPosition(
        triggerRef.current.getBoundingClientRect(),
        tooltipRef.current.getBoundingClientRect(),
        placement,
        { width: window.innerWidth, height: window.innerHeight }
      );
      setPosition(result.position);
      setCurrentPlacement(result.placement);
    }
  }, [isVisible, placement]);

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-600 rounded shadow-lg"
      style={{ top: `${position.top}px`, left: `${position.left}px`, transform: 'translate(-50%, -50%)' }}
      role="tooltip"
    >
      {text}
      <div
        className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-600 transform rotate-45 ${
          currentPlacement === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''
        }${currentPlacement === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
        ${currentPlacement === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
        ${currentPlacement === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}`}
      />
    </div>
  );

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && createPortal(tooltipContent, document.body)}
    </div>
  );
};

interface PositionResult {
  position: { top: number; left: number };
  placement: TooltipProps['placement'];
}

function calculateTooltipPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  preferredPlacement: TooltipProps['placement'],
  windowBox: { width: number; height: number }
): PositionResult {
  const tooltipHeight = tooltipRect.height;
  const tooltipWidth = tooltipRect.width;

  // Try placements in clockwise order starting from the preferred placement
  const placements: TooltipProps['placement'][] = ['top', 'right', 'bottom', 'left'];
  const preferredIndex = placements.indexOf(preferredPlacement);
  const orderedPlacements = [...placements.slice(preferredIndex), ...placements.slice(0, preferredIndex)];

  let top = 0;
  let left = 0;
  let currentPlacementState: TooltipProps['placement'] = preferredPlacement;

  for (const currentPlacement of orderedPlacements) {
    let candidateTop = 0;
    let candidateLeft = 0;

    switch (currentPlacement) {
      case 'top':
        candidateTop = triggerRect.top - tooltipHeight / 2 - 8;
        candidateLeft = triggerRect.left + triggerRect.width / 2;
        break;
      case 'bottom':
        candidateTop = triggerRect.bottom + tooltipHeight / 2 + 8;
        candidateLeft = triggerRect.left + triggerRect.width / 2;
        break;
      case 'left':
        candidateTop = triggerRect.top + triggerRect.height / 2;
        candidateLeft = triggerRect.left - tooltipWidth / 2 - 8;
        break;
      case 'right':
        candidateTop = triggerRect.top + triggerRect.height / 2;
        candidateLeft = triggerRect.right + tooltipWidth / 2 + 8;
        break;
    }

    // Check if tooltip fits on this placement
    const fits = candidateTop >= tooltipHeight / 2 &&
                 candidateTop <= windowBox.height - tooltipHeight / 2 &&
                 candidateLeft >= tooltipWidth / 2 &&
                 candidateLeft <= windowBox.width - tooltipWidth / 2;

    if (fits) {
      currentPlacementState = currentPlacement;
      top = candidateTop;
      left = candidateLeft;
      break;
    }
  }

  // Clamp to viewport bounds
  const maxX = windowBox.width - tooltipWidth / 2;
  const maxY = windowBox.height - tooltipHeight / 2;
  const minX = tooltipWidth / 2;
  const minY = tooltipHeight / 2;
  top = Math.max(minY, Math.min(top, maxY));
  left = Math.max(minX, Math.min(left, maxX));

  return { position: { top, left }, placement: currentPlacementState };
}
