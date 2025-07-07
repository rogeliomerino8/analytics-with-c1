import { Button } from "@crayonai/react-ui";
import { Send } from "lucide-react";

export const Composer = () => {
  return (
    <div className="py-xs px-s border border-default rounded-xl flex items-center justify-between gap-s">
      <input
        type="text"
        placeholder="Type here..."
        className="flex-1 outline-none"
      />
      <Button variant="primary" iconLeft={<Send />} />
    </div>
  );
};
