import React from "react";
import ExploreCompanies from "@/pages/recruiter/ExploreCompanies";
import CandidateLayout from "@/layouts/CandidateLayout";

const CandidateExploreCompanies = () => {
  return (
    <CandidateLayout>
      <ExploreCompanies userRole="candidate" />
    </CandidateLayout>
  );
};

export default CandidateExploreCompanies;
