/* 
 * LEGACY APP FILE - KEPT FOR REFERENCE
 * This file is not currently in use.
 * The active app component is in App.tsx (uppercase)
 */

import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/home";
import { TeamsPage } from "@/pages/teams";
import { TeamPage } from "@/pages/team";
import { FundraisersPage } from "@/pages/fundraisers";
import { FundraiserPage } from "@/pages/fundraiser";
import { IncentivesPage } from "@/pages/incentives";
import { VolunteerPage } from "@/pages/volunteer";
import { SponsorsPage } from "@/pages/sponsors";
import { GuidePage } from "@/pages/guide";
import { NotFound } from "@/pages/not-found";

function AppLegacy() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:teamId" element={<TeamPage />} />
        <Route path="/fundraisers" element={<FundraisersPage />} />
        <Route path="/fundraisers/:fundraiserId" element={<FundraiserPage />} />
        <Route path="/incentives" element={<IncentivesPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default AppLegacy;