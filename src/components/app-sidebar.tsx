"use client";
import React, { useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ChevronsUpDown,
  BadgeCheck,
  CreditCard,
  LogOut,
  NotebookPen,
  ChartNoAxesCombined,
  Brain,
  PenLine,
  Archive,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

// Add props interface
interface AppSidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({
  className,
  isOpen = true,
  onClose,
}: AppSidebarProps) {
  const { data: session } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");

  useEffect(() => {
    if (session?.user) {
      setImage(session?.user?.image || null);
      const [first, ...last] = session.user.name.split(" ");
      setFirstName(first || "");
      setLastName(last.join(" ") || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  // Restrict scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      // Add class to body to disable scrolling
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Remove class when sidebar is closed or on desktop
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Define navigation items based on login status
  const getNavItems = () => {
    const basePath = "/examprep";

    if (session) {
      // User is logged in - show all items
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          href: `${basePath}/dashboard`,
        },
        { icon: NotebookPen, label: "Practice", href: `${basePath}/practice` },
        { icon: FileText, label: "PYQ Bank", href: `${basePath}/pyqbank` },
        { icon: BookOpen, label: "Mock", href: `${basePath}/mock` },
        { icon: PenLine, label: "Quiz", href: `${basePath}/quiz` },
        { icon: Brain, label: "BrainStorm", href: `${basePath}/brainstorm` },
        {
          icon: ChartNoAxesCombined,
          label: "Analysis",
          href: `${basePath}/analysis`,
        },
        { icon: Archive, label: "Archive", href: "/archive" },
      ];
    } else {
      // User is NOT logged in - show limited items
      return [
        { icon: NotebookPen, label: "Practice", href: `${basePath}/practice` },
        { icon: FileText, label: "PYQ Bank", href: `${basePath}/pyqbank` },
        { icon: BookOpen, label: "Mock", href: `${basePath}/mock` },
        { icon: PenLine, label: "Quiz", href: `${basePath}/quiz` },
        { icon: Archive, label: "Archive", href: "/archive" },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay - Only show when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar with increased z-index */}
      <aside
        className={cn(
          "fixed md:relative top-0 left-0 z-40 h-screen md:h-auto flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out pt-36 md:pt-3 shadow-lg md:shadow-none",
          className,
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isOpen ? "w-60" : "w-0 md:w-60"
        )}
      >
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 md:hidden z-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Navigation Section - Takes available space, pushes user menu to bottom */}
        <ScrollArea className="flex-1 mt-0 md:mt-0">
          <nav className="space-y-1 p-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 ease-in-out rounded-md"
                asChild
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth <= 768 && onClose) {
                    onClose();
                  }
                }}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="transition-all duration-200 font-medium">
                    {item.label}
                  </span>
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>

        {/* User Menu Section - Only show if logged in AND sidebar is open */}
        {/* This stays inside sidebar on desktop, but separate on mobile */}
        {session && isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-center gap-2 px-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-in-out rounded-lg"
                >
                  <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-105">
                    <AvatarImage src={image || undefined} alt={firstName} />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                      {firstName[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      {firstName + " " + lastName || "User"}
                    </span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg"
                align="end"
                side="right"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal p-0 hover:bg-transparent">
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={image || undefined} alt={firstName} />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                        {firstName[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-gray-900 dark:text-white">
                        {firstName + " " + lastName || "User"}
                      </span>
                      <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuGroup>
                  <Link href="/examprep/account">
                    <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-indigo-950/30 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 cursor-pointer transition-colors duration-200 rounded-md my-1">
                      <BadgeCheck className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        Account
                      </span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-indigo-950/30 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 cursor-pointer transition-colors duration-200 rounded-md my-1">
                    <CreditCard className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      Billing
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem
                  className="hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer text-red-600 dark:text-red-400 transition-colors duration-200 rounded-md my-1 font-medium"
                  onClick={() => signOut({ callbackUrl: "/examprep" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* Separate Mobile Bottom Menu - Only shows on mobile when sidebar is open */}
      {session && isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3 shadow-lg transition-all duration-300">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center gap-2 px-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-in-out rounded-lg"
              >
                <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-105">
                  <AvatarImage src={image || undefined} alt={firstName} />
                  <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                    {firstName[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                    {firstName + " " + lastName || "User"}
                  </span>
                  <span className="truncate text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {email || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg mb-2"
              align="end"
              side="top"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal p-0 hover:bg-transparent">
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={image || undefined} alt={firstName} />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                      {firstName[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-gray-900 dark:text-white">
                      {firstName + " " + lastName || "User"}
                    </span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {email || ""}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuGroup>
                <Link href="/examprep/account">
                  <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-indigo-950/30 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 cursor-pointer transition-colors duration-200 rounded-md my-1">
                    <BadgeCheck className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      Account
                    </span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-indigo-950/30 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 cursor-pointer transition-colors duration-200 rounded-md my-1">
                  <CreditCard className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    Billing
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem
                className="hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer text-red-600 dark:text-red-400 transition-colors duration-200 rounded-md my-1 font-medium"
                onClick={() => signOut({ callbackUrl: "/examprep" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
