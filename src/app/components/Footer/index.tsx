import { Button } from "@crayonai/react-ui";
import { ArrowRightIcon } from "lucide-react";
import { m } from "framer-motion";

export const Footer = () => (
  <m.div
    key="footer"
    className="text-center mt-[100px] flex flex-col items-center gap-[24px]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <p className="text-sm text-gray-500">
      This dashboard is powered by the C1 GenUI API <br /> and uses sample data
      for demonstration purposes.
    </p>
    <Button
      variant="secondary"
      size="large"
      iconRight={<ArrowRightIcon />}
      onClick={() =>
        window.open("https://docs.thesys.dev/guides/overview", "_blank")
      }
    >
      View Documentation
    </Button>
  </m.div>
);
