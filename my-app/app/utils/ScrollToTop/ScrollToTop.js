import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ScrollToTop = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.asPath]);

  return <>{children}</>;
};

export default ScrollToTop;
