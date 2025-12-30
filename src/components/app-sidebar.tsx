"use client";
import React from "react";
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
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function AppSidebar({ className }: { className?: string }) {
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
        { icon: Archive, label: "Archive", href: `${basePath}/archive` }, // Added Archive
      ];
    } else {
      // User is NOT logged in - show limited items
      return [
        { icon: NotebookPen, label: "Practice", href: `${basePath}/practice` },
        { icon: FileText, label: "PYQ Bank", href: `${basePath}/pyqbank` },
        { icon: BookOpen, label: "Mock", href: `${basePath}/mock` },
        { icon: PenLine, label: "Quiz", href: `${basePath}/quiz` },
        { icon: Archive, label: "Archive", href: `${basePath}/archive` }, // Added Archive
        // Dashboard, Brainstorm, and Analysis are NOT included here
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        "flex flex-col justify-around bg-muted-background border-r transition-all duration-300 ease-in-out pt-20",
        className
      )}
    >
      {/* Navigation Section */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* User Menu Section - Only show if logged in AND sidebar is open */}
      {session && className !== "w-0" && (
        <div className="border-t border-b p-2 sticky bottom-0 left-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center gap-2 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={image || undefined} alt={firstName} />
                  <AvatarFallback>{firstName[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {firstName + " " + lastName || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64"
              align="end"
              side="right"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-2 p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={image || undefined} alt={firstName} />
                    <AvatarFallback>{firstName[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {firstName + " " + lastName || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email || ""}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/examprep/account">
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
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
  );
}
