import { MutableRefObject, RefObject, useEffect } from "react";

interface Props {
  target: RefObject<null> | RefObject<HTMLElement>;
  onIntersect: IntersectionObserverCallback;
  root?: null | HTMLElement;
  rootMargin?: string;
  threshold?: number;
}

export default function useObserver({
  target,
  onIntersect,
  root = null,
  rootMargin = "0px",
  threshold = 1.0,
}: Props) {
  useEffect(() => {
    let observer: IntersectionObserver;

    if (target && target.current) {
      observer = new IntersectionObserver(onIntersect, {
        root,
        rootMargin,
        threshold,
      });
      observer.observe(target.current);
    }
    return () => observer && observer.disconnect();
  }, [root, onIntersect, target, rootMargin, threshold]);
}
