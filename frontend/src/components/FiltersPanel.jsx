import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FiltersPanel = ({
  industries = [],
  locations = [],
  sizes = [],
  selectedIndustries = [],
  selectedLocations = [],
  selectedSizes = [],
  hasJobs = false,
  onIndustryChange,
  onLocationChange,
  onSizeChange,
  onHasJobsChange,
  onClearFilters,
  className,
}) => {
  const [openSections, setOpenSections] = useState({
    industry: true,
    location: true,
    size: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    selectedIndustries.length > 0 ||
    selectedLocations.length > 0 ||
    selectedSizes.length > 0 ||
    hasJobs;

  const getActiveFilterCount = () => {
    return (
      selectedIndustries.length +
      selectedLocations.length +
      selectedSizes.length +
      (hasJobs ? 1 : 0)
    );
  };

  const FilterSection = ({
    title,
    icon: Icon,
    items,
    selectedItems,
    onItemChange,
    sectionKey,
    maxInitialItems = 5,
  }) => {
    const [showAll, setShowAll] = useState(false);
    const displayItems = showAll ? items : items.slice(0, maxInitialItems);
    const hasMore = items.length > maxInitialItems;

    return (
      <Collapsible
        open={openSections[sectionKey]}
        onOpenChange={() => toggleSection(sectionKey)}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium text-gray-900 hover:text-blue-600"
          >
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4" />
              <span>{title}</span>
              {selectedItems.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 text-xs">
                  {selectedItems.length}
                </Badge>
              )}
            </div>
            {openSections[sectionKey] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {displayItems.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={`${sectionKey}-${item}`}
                checked={selectedItems.includes(item)}
                onCheckedChange={(checked) => {
                  onItemChange(item, checked);
                }}
              />
              <Label
                htmlFor={`${sectionKey}-${item}`}
                className="text-sm text-gray-700 cursor-pointer flex-1 truncate"
              >
                {item}
              </Label>
            </div>
          ))}
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? "Show less"
                : `Show ${items.length - maxInitialItems} more`}
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <Card className={cn("h-fit sticky top-6", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <Badge variant="default" className="ml-2 h-6">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-red-600 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Has Jobs Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-gray-600" />
            <Label htmlFor="has-jobs" className="text-sm font-medium">
              Has open positions
            </Label>
          </div>
          <Switch
            id="has-jobs"
            checked={hasJobs}
            onCheckedChange={onHasJobsChange}
          />
        </div>

        <Separator />

        {/* Industry Filter */}
        {industries.length > 0 && (
          <>
            <FilterSection
              title="Industry"
              icon={Building2}
              items={industries}
              selectedItems={selectedIndustries}
              onItemChange={(industry, checked) => {
                onIndustryChange?.(industry, checked);
              }}
              sectionKey="industry"
            />
            <Separator />
          </>
        )}

        {/* Location Filter */}
        {locations.length > 0 && (
          <>
            <FilterSection
              title="Location"
              icon={MapPin}
              items={locations}
              selectedItems={selectedLocations}
              onItemChange={(location, checked) => {
                onLocationChange?.(location, checked);
              }}
              sectionKey="location"
            />
            <Separator />
          </>
        )}

        {/* Company Size Filter */}
        <FilterSection
          title="Company Size"
          icon={Users}
          items={sizes}
          selectedItems={selectedSizes}
          onItemChange={(size, checked) => {
            onSizeChange?.(size, checked);
          }}
          sectionKey="size"
          maxInitialItems={10}
        />
      </CardContent>
    </Card>
  );
};

export default FiltersPanel;
