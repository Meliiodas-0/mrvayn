import { notFound } from "next/navigation";
import { CursorMotionLab } from "@/components/fx/CursorMotionLab";

export const metadata = {
  title: "Local cursor motion study",
  robots: { index: false, follow: false },
};
export default function CursorLabPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <CursorMotionLab />;
}
