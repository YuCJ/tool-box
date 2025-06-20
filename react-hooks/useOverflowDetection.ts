import React from 'react';

interface OverflowState {
  horizontal: boolean;
  vertical: boolean;
}

/**
 * Hook to detect if an element's content is overflowing
 * @returns [ref, overflowState] - Attach ref to the element you want to monitor
 */
export function useOverflowDetection(): [React.RefCallback<HTMLElement>, OverflowState] {
  const [overflowState, setOverflowState] = React.useState<OverflowState>({
    horizontal: false,
    vertical: false,
  });

  const cleanupRef = React.useRef<(() => void) | null>(null);

  const checkOverflow = React.useCallback((element: HTMLElement) => {
    const horizontal = element.scrollWidth > element.clientWidth;
    const vertical = element.scrollHeight > element.clientHeight;

    setOverflowState({
      horizontal,
      vertical,
    });
  }, []);

  const ref = React.useCallback(
    (element: HTMLElement | null) => {
      // Cleanup previous observers if any
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (!element) return;

      // Check overflow immediately
      checkOverflow(element);

      // Use ResizeObserver to detect when element or its content changes
      const resizeObserver = new ResizeObserver(() => checkOverflow(element));
      resizeObserver.observe(element);

      // Also observe all children for size changes
      const observeChildren = () => {
        Array.from(element.children).forEach(child => {
          resizeObserver.observe(child as Element);
        });
      };

      observeChildren();

      // Use MutationObserver to detect when direct children are added/removed
      const mutationObserver = new MutationObserver(() => {
        checkOverflow(element);
        observeChildren();
      });

      mutationObserver.observe(element, {
        childList: true, // Only watch direct children changes
      });

      // Store cleanup function
      cleanupRef.current = () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    },
    [checkOverflow],
  );

  return [ref, overflowState];
}
