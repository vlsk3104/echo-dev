import OrganizationGuard from "@/modules/auth/ui/components/organization-guard";
import DashboardLayout from "@/modules/dashboard/ui/layouts/dashboard-layout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout>
      <OrganizationGuard>{children}</OrganizationGuard>
    </DashboardLayout>
  );
};

export default Layout;
