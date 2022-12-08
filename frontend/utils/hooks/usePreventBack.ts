import { useEffect } from "react";

const usePreventBack = () => {
  useEffect(() => {
    history.pushState(null, "", "");
    window.onpopstate = () => {
      history.go(1);
    };

    return () => {
      window.onpopstate = () => {};
    };
  }, []);
};

export { usePreventBack };
