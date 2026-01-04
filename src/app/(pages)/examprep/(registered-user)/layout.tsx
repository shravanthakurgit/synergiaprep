"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, PanelRightClose, PanelRightOpen, Menu } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Define the props interface
interface PageProps {
  children: ReactNode; // To accept children elements
}

export default function Page({ children }: PageProps) {
  const segments = useSelectedLayoutSegments();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: session } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (session?.user) {
      setImage(session.user.image || null);
      setFirstName(session?.user.name.split(" ")[0][0]);
    }
  }, [session]);

  useEffect(() => {
    // Function to check if the user is on a mobile device
    const checkDevice = () => {
      const isMobile = window.innerWidth <= 768;
      setIsSidebarOpen(!isMobile);
    };

    checkDevice();

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex pt-[4.2rem] min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900">
      <SidebarProvider>
        <Separator />
        <AppSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header - Fixed position */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              {/* Mobile Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Desktop Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <PanelRightOpen className="h-5 w-5" /> : <PanelRightClose className="h-5 w-5" />}
              </Button>
              
              <span className="font-semibold text-lg">Examprep</span>
              <ul className="hidden md:flex items-center ml-4">
                {segments.map((segment, index) => (
                  <div className="flex flex-row items-center gap-2" key={index}>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground items-center">
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </span>
                  </div>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={image || undefined} />
                <AvatarFallback>{firstName}</AvatarFallback>
              </Avatar>
            </div>
          </header>
          
          {/* Mobile Breadcrumbs */}
          {segments.length > 0 && (
            <div className="md:hidden border-b bg-white/80 dark:bg-gray-900/80 px-4 py-2 sticky top-16 z-30">
              <div className="flex items-center text-sm text-muted-foreground overflow-x-auto">
                {segments.map((segment, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />}
                    <span className="whitespace-nowrap">
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}