"use client";

import { useOrganization } from "@clerk/nextjs";
import AuthLayout from "../layouts/auth-layout";
import OrgSelectionView from "../views/org-selection-view";

const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
  const { organization } = useOrganization();

  if (!organization?.id) {
    return (
      <AuthLayout>
        <OrgSelectionView />
      </AuthLayout>
    );
  }

  return <>{children}</>;
};

export default OrganizationGuard;
