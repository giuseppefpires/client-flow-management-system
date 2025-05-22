
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Users,
  FileText,
  ClipboardList,
  Settings,
  Home,
  PieChart,
  Calendar
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed: boolean;
}

export function SidebarNav({ className, collapsed, ...props }: SidebarNavProps) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      href: "/",
    },
    {
      title: "Clientes",
      icon: <Users size={20} />,
      href: "/clientes",
    },
    {
      title: "Funil de Vendas",
      icon: <BarChart size={20} />,
      href: "/funil",
    },
    {
      title: "Propostas",
      icon: <FileText size={20} />,
      href: "/propostas",
    },
    {
      title: "Contratos",
      icon: <ClipboardList size={20} />,
      href: "/contratos",
    },
    {
      title: "Serviços",
      icon: <Calendar size={20} />,
      href: "/servicos",
    },
    {
      title: "Financeiro",
      icon: <PieChart size={20} />,
      href: "/financeiro",
    },
    {
      title: "Configurações",
      icon: <Settings size={20} />,
      href: "/configuracoes",
    }
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen py-4 transition-all duration-300 bg-sidebar border-r",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex items-center justify-center h-14 mb-4",
        collapsed ? "px-2" : "px-6"
      )}>
        {collapsed ? (
          <span className="text-2xl font-bold text-primary">SG</span>
        ) : (
          <span className="text-lg font-bold text-primary">Sistema de Gestão</span>
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");

            return (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={cn(
                        "flex items-center rounded-md p-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground",
                        collapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </ScrollArea>

      <div className={cn(
        "mt-auto border-t border-border pt-4 px-2",
        collapsed ? "text-center" : "px-6"
      )}>
        {!collapsed && (
          <div className="flex flex-col mb-4 text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          className={cn(
            "w-full justify-center"
          )}
        >
          {collapsed ? "Sair" : "Sair do Sistema"}
        </Button>
      </div>
    </div>
  );
}
