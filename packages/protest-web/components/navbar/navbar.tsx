import { cn } from "@/../shared/src";
import { Staatliches } from "next/font/google";
import { HandMetal } from "lucide-react";

const stattliches = Staatliches({
  weight: ["400"],
  subsets: ["latin"],
});

export const Navbar = () => {
  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 pt-4 z-50">
      <div className="py-4 px-8 border rounded-3xl shadow-sm flex items-center">
        <div
          className={cn(
            stattliches.className,
            "font-bold text-2xl text-amber-600 flex items-center gap-4"
          )}
        >
          <HandMetal />
          <div>Protest</div>
        </div>
      </div>
    </div>
  );
};
