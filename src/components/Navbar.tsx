"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import productsData from "@/tempdata/products.json";

const products = productsData.products;

export function Navbar() {
  // Mobile menu should be closed by default
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-[#0f3bfe] to-[#0f3bfe] text-white shadow-md fixed z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center space-x-0">
          <Image
            src="/assets/images/android-chrome-192x192.png"
            alt="SynergiaPrep logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <h4 className="text-xl font-semibold">SynergiaPrep</h4>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex items-center justify-center w-full">
          <NavigationMenuList className="flex space-x-3">
            {/* Home */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "p-2 bg-[#0f3bfe] cursor-pointer"
                  )}
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* About Us */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "p-2 bg-[#0f3bfe] cursor-pointer"
                  )}
                >
                  About Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* SynergiaTech Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="p-2 bg-[#0f3bfe] flex items-center gap-1">
                SynergiaTech
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-1/2 -translate-x-1/2">
                <ul className="grid gap-2 p-4 w-72 bg-white text-black shadow-lg rounded-md">
                  {products.map((product) => (
                    <ListItem
                      key={product.title}
                      title={product.title}
                      href={
                        product.title === "Chemicals and Instruments"
                          ? "/products/instruments-and-chemicals"
                          : product.href
                      }
                      className="hover:bg-indigo-100"
                      onClick={handleLinkClick}
                    >
                      {product.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Exam Prep - Fixed */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/examprep"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "p-2 bg-[#0f3bfe] cursor-pointer"
                  )}
                >
                  ExamPrep
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Study Abroad */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/study-abroad"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "p-2 bg-[#0f3bfe] cursor-pointer"
                  )}
                >
                  Study Abroad
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Blog */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "p-2 bg-[#0f3bfe] cursor-pointer"
                  )}
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Contact Us */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact-us"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "p-2 bg-[#0f3bfe] cursor-pointer"
                  )}
                >
                  Contact Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* Archive Button */}
          <Link
            href="/archive"
            className="hidden lg:flex w-32 bg-transparent border-2 border-white font-semibold text-white h-12 px-2 py-1 rounded-xl hover:bg-white hover:text-blue-800 transition duration-500 items-center justify-center"
          >
            Archive
          </Link>

          {/* Join Now / Logout Button */}
          {!session &&(
            <Link
              href="/login"
              className="sm:w-32 bg-white font-semibold text-blue-800 sm:h-12 px-2 py-1 rounded-md hover:bg-gray-300 hover:text-black transition duration-500 flex items-center justify-center"
            >
              Join Now
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-2"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white text-black py-4 px-6 space-y-4 shadow-md">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <Link
                href="/"
                className="flex items-center justify-between py-4 text-sm font-medium transition-all no-underline"
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </AccordionItem>

            <AccordionItem value="item-2">
              <Link
                href="/about"
                className="flex items-center justify-between py-4 text-sm font-medium transition-all no-underline"
                onClick={handleLinkClick}
              >
                About Us
              </Link>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>SynergiaTech</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                {products.map((product) => (
                  <Link
                    key={product.title}
                    href={
                      product.title === "Chemicals and Instruments"
                        ? "/products/instruments-and-chemicals"
                        : product.href
                    }
                    className="pl-4 hover:underline"
                    onClick={handleLinkClick}
                  >
                    {product.title}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <Link
                href="/examprep"
                className="flex items-center justify-between py-4 text-sm font-medium transition-all no-underline"
                onClick={handleLinkClick}
              >
                ExamPrep
              </Link>
            </AccordionItem>

            <AccordionItem value="item-5">
              <Link
                href="/study-abroad"
                className="flex items-center justify-between py-4 text-sm font-medium transition-all no-underline"
                onClick={handleLinkClick}
              >
                Study Abroad
              </Link>
            </AccordionItem>

            <AccordionItem value="item-6">
              <Link
                href="/blog"
                className="flex items-center justify-between py-4 text-sm font-medium transition-all no-underline"
                onClick={handleLinkClick}
              >
                Blog
              </Link>
            </AccordionItem>

            <AccordionItem value="item-7">
              <Link
                href="/contact-us"
                className="flex items-center justify-between py-4 text-sm font-medium transition-all no-underline"
                onClick={handleLinkClick}
              >
                Contact Us
              </Link>
            </AccordionItem>

            {/* Archive for Mobile */}
            <AccordionItem value="item-8">
              <Link
                href="/archive"
                className="flex items-center justify-between py-4 text-sm font-medium transition-all no-underline"
                onClick={handleLinkClick}
              >
                Archive
              </Link>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col gap-3">
            <Link
              href="/archive"
              className="block w-full mt-2 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition text-center font-semibold"
              onClick={handleLinkClick}
            >
              Archive
            </Link>
            {session ? (
              <button
                onClick={() => {
                  handleLinkClick();
                  signOut({ callbackUrl: "/examprep" });
                }}
                className="block w-full border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 transition text-center font-semibold"
              >
                <LogOut className="inline mr-2" /> Log out
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 transition text-center font-semibold"
                onClick={handleLinkClick}
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { onClick?: () => void }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/70 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={props.href || "#"}
          onClick={props.onClick}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
