import { observer } from 'mobx-react-lite';
import { iframeLayoutStore } from '@/stores';

export const HoverZone = observer(() => {
  const handleMouseEnter = () => {
    iframeLayoutStore.setHoveringLeftEdge(true);
  };

  const handleMouseLeave = () => {
    iframeLayoutStore.setHoveringLeftEdge(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed top-0 left-0 w-16 h-screen z-30"
      aria-hidden="true"
    />
  );
});
