import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export default function CompanyChoice() {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-40 flex justify-center py-5 flex-1">
      <div className="layout-content-container flex flex-col w-full max-w-[512px] py-5 flex-1">
        <h2 className="text-[#101518] text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Do you want to join an existing company or create a new one?
        </h2>

        <Separator className="my-4" />

        <Card className="bg-gray-50 shadow-none">
          <CardContent className="flex items-center justify-between gap-4 py-4 px-4">
            <div className="flex flex-col justify-center">
              <p className="text-[#101518] text-base font-medium leading-normal line-clamp-1">
                Join an Existing Company
              </p>
              <p className="text-[#5c758a] text-sm font-normal leading-normal line-clamp-2">
                Request to join a company and collaborate with their team.
              </p>
            </div>
            <Button
              variant="ghost"
              className="bg-[#eaeef1] text-[#101518] h-8 px-4 rounded-full"
              onClick={() => navigate("/recruiter/join-company")}
            >
              Join Company
            </Button>
          </CardContent>
        </Card>

        <div className="h-4" />

        <Card className="bg-gray-50 shadow-none">
          <CardContent className="flex items-center justify-between gap-4 py-4 px-4">
            <div className="flex flex-col justify-center">
              <p className="text-[#101518] text-base font-medium leading-normal line-clamp-1">
                Create a New Company
              </p>
              <p className="text-[#5c758a] text-sm font-normal leading-normal line-clamp-2">
                Set up a new company profile and start posting jobs.
              </p>
            </div>
            <Button
              variant="ghost"
              className="bg-[#eaeef1] text-[#101518] h-8 px-4 rounded-full"
              onClick={() => navigate("/recruiter/create-company")}
            >
              Create Company
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
