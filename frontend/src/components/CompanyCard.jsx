import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPinned,
  UserSquare,
  Award,
  ExternalLink,
  Star,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CompanyCard = ({ company, className, onViewJobs, onViewDetails }) => {
  const {
    _id,
    name,
    industry,
    location,
    size,
    logo,
    description,
    website,
    jobCount = 0,
    verified = false,
  } = company;

  const getCompanyInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewWebsite = (e) => {
    e.stopPropagation();
    if (website) {
      window.open(
        website.startsWith("http") ? website : `https://${website}`,
        "_blank"
      );
    }
  };

  const handleViewJobs = (e) => {
    e.stopPropagation();
    onViewJobs?.(company);
  };

  const handleViewDetails = () => {
    onViewDetails?.(company);
  };

  return (
    <Card
      className={cn(
        "group h-full transition-all duration-200 cursor-pointer",
        "hover:shadow-md border border-gray-200 bg-white",
        "hover:border-gray-300",
        className
      )}
      onClick={handleViewDetails}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-gray-100">
              <AvatarImage src={logo} alt={`${name} logo`} />
              <AvatarFallback className="bg-gray-900 text-white font-medium text-sm">
                {getCompanyInitials(name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900 truncate text-base group-hover:text-gray-700 transition-colors">
                  {name}
                </h3>
                {verified && (
                  <Star className="h-4 w-4 fill-gray-400 text-gray-400 flex-shrink-0" />
                )}
              </div>
              {industry && (
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {industry}
                </p>
              )}
            </div>
          </div>

          {website && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
              onClick={handleViewWebsite}
            >
              <ExternalLink className="h-4 w-4 text-gray-600" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {location && (
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <MapPinned className="h-3 w-3 mr-1 text-indigo-600" />
              {location}
            </Badge>
          )}
          {size && (
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <UserSquare className="h-3 w-3 mr-1 text-indigo-600" />
              {size} employees
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Award className="h-4 w-4 text-indigo-600" />
            <span className="font-medium">{jobCount}</span>
            <span>{jobCount === 1 ? "job" : "jobs"}</span>
          </div>

          {jobCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              onClick={handleViewJobs}
            >
              View Jobs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
