import Navegador from "./Navegador";
import { useState } from "react";

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout-container">
      <Navegador onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}