
import React, { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav collapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="md:mr-4"
              aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              <Menu size={20} />
            </Button>
            <h1 className="text-lg font-semibold hidden md:block">Sistema de Gestão</h1>
          </div>
          
          <UserProfileDropdown />
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
