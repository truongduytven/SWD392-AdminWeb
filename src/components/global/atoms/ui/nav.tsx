/** @format */

"use client";

import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/global/atoms/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/global/atoms/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useLocation } from 'react-router-dom';

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const location = useLocation();
  const pathName = location.pathname;

  // Separate the logout link from other links
  const logoutLink = links.find(link => link.title === "Đăng xuất");
  const otherLinks = links.filter(link => link.title !== "Đăng xuất");

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group transition-all duration-300 ease-in-out flex flex-col h-full py-2 data-[collapsed=true]:py-2"
      >
        <nav className="grid transition-all duration-300 ease-in-out pr-8 gap-2 px-3 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {otherLinks.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={link.href}
                    className={cn(
                      buttonVariants({
                        variant: link.href === pathName ? "default" : "ghost",
                        size: "icon"
                      }),
                      "h-10 w-10",
                      link.href === pathName && "text-white bg-[#F9802D]",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}
                  {link.label && (
                    <span className="ml-auto text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={index}
                to={link.href}
                className={cn(
                  buttonVariants({
                    variant: link.href === pathName ? "default" : "ghost",
                    size: "lg"
                  }),
                  link.href === pathName && "text-white bg-[#F9802D]",

                  link.variant === "default" &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start mr-5"
                )}
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.variant === "default" &&
                        "text-background dark:text-white "
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            )
          )}
        </nav>

        {logoutLink && (
          <div className="px-3 mt-56">
            {isCollapsed ? (
              <Tooltip key="logout" delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={logoutLink.href}
                    className={cn(
                      buttonVariants({
                        variant: logoutLink.href === pathName ? "default" : "ghost",
                        size: "icon"
                      }),
                      "h-10 w-10",
                      logoutLink.href === pathName && "text-white bg-[#F9802D]",
                      logoutLink.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <logoutLink.icon className="h-5 w-5" />
                    <span className="sr-only">{logoutLink.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {logoutLink.title}
                  {logoutLink.label && (
                    <span className="ml-auto text-muted-foreground">
                      {logoutLink.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key="logout"
                to={logoutLink.href}
                className={cn(
                  buttonVariants({
                    variant: logoutLink.href === pathName ? "default" : "ghost",
                    size: "lg"
                  }),
                  logoutLink.href === pathName && "text-white bg-primary",

                  logoutLink.variant === "default" &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start mr-5"
                )}
              >
                <logoutLink.icon className="mr-3 h-5 w-5" />
                {logoutLink.title}
                {logoutLink.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      logoutLink.variant === "default" &&
                        "text-background dark:text-white "
                    )}
                  >
                    {logoutLink.label}
                  </span>
                )}
              </Link>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
