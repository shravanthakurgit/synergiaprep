import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import CourseList from "@/components/course-list";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      
      {children}
      <Toaster />
      <Separator className="my-4" />
      <Footer />
    </>
  );
}
