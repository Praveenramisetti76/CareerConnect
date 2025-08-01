import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CreateCompanySchema } from "@/validation/company.validation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageCropModal from "@/components/ImageCropModal";
import LoadingScreen from "@/components/LodingScreen";
import {
  createCompany,
  uploadCompanyLogo,
  uploadCompanyCover,
} from "@/api/companyApi";
import { useCompanyStore } from "@/store/companyStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateCompany = () => {
  const navigate = useNavigate();
  const { setCompanyId, setCompanyRole } = useCompanyStore();
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cropType, setCropType] = useState("logo");
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({ resolver: zodResolver(CreateCompanySchema) });

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCropType("logo");
        setModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCropType("cover");
        setModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedFile) => {
    if (cropType === "logo") {
      setLogoFile(croppedFile);
      const previewUrl = URL.createObjectURL(croppedFile);
      setLogoPreview(previewUrl);
    } else if (cropType === "cover") {
      setCoverFile(croppedFile);
      const previewUrl = URL.createObjectURL(croppedFile);
      setCoverPreview(previewUrl);
    }
  };

  const logoMutation = useMutation({
    mutationFn: ({ file, companyId }) => uploadCompanyLogo(companyId, file),
    onSuccess: (data) => {
      toast.success("Logo uploaded successfully");
      setLogoPreview(data.logo);
    },
    onError: () => toast.error("Logo upload failed"),
  });

  const coverMutation = useMutation({
    mutationFn: ({ file, companyId }) => uploadCompanyCover(companyId, file),
    onSuccess: (data) => {
      toast.success("Cover image uploaded successfully");
      setCoverPreview(data.coverImage);
    },
    onError: () => toast.error("Cover upload failed"),
  });

  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: async (data) => {
      const companyId = data.company.id || data.company._id;
      const userRole = data.userRole || "admin";

      setCompanyId(companyId);
      setCompanyRole(userRole);

      if (logoFile) {
        try {
          await logoMutation.mutateAsync({ file: logoFile, companyId });
        } catch (error) {
          console.error("Logo upload failed:", error);
        }
      }

      if (coverFile) {
        try {
          await coverMutation.mutateAsync({ file: coverFile, companyId });
        } catch (error) {
          console.error("Cover upload failed:", error);
        }
      }

      toast.success("Company Created Successfully!");
      navigate("/recruiter/dashboard");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create company");
    },
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  // Show loading screen when creating company
  if (mutation.isPending) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-6 md:px-40">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-[#101518] text-[28px] font-bold leading-tight mb-2">
            Create Your Company
          </h1>
          <p className="text-[#5c758a] text-base">
            Set up your company profile to start posting jobs and finding talent
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Required Fields Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">Note:</span> Fields marked with an asterisk (*) are required.
            </p>
          </div>
          
          {/* Company Logo Section */}
          <div className="mb-8">
            <h2 className="text-[#101518] text-xl font-semibold mb-4">
              Company Logo
            </h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#d5dce2] rounded-lg p-8 hover:border-gray-400 transition-colors bg-gray-50">
              {logoPreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-32 h-32 object-cover rounded-full mb-4 border border-[#d5dce2]"
                  />
                  <p className="text-sm text-[#5c758a] mb-4">
                    Logo selected (512x512)
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium text-[#101518] mb-2">
                    Upload Company Logo
                  </p>
                  <p className="text-sm text-[#5c758a] mb-4">
                    Drag and drop or browse to upload (Recommended: 512x512px)
                  </p>
                </>
              )}
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-[#eaeef1] text-[#101518] border-[#d5dce2]"
                onClick={() => document.getElementById("logo-upload").click()}
              >
                {logoPreview ? "Change Logo" : "Choose Logo File"}
              </Button>
            </div>
          </div>

          {/* Company Cover Section */}
          <div className="mb-8">
            <h2 className="text-[#101518] text-xl font-semibold mb-4">
              Company Cover Image
            </h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#d5dce2] rounded-lg p-8 hover:border-gray-400 transition-colors bg-gray-50">
              {coverPreview ? (
                <div className="flex flex-col items-center w-full">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full max-w-lg h-48 object-contain rounded-lg mb-4 border border-[#d5dce2] bg-gray-100"
                  />
                  <p className="text-sm text-[#5c758a] mb-4">
                    Cover image selected (1200x675)
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium text-[#101518] mb-2">
                    Upload Company Cover Image
                  </p>
                  <p className="text-sm text-[#5c758a] mb-4">
                    Drag and drop or browse to upload (Recommended: 1200x675px)
                  </p>
                </>
              )}
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-[#eaeef1] text-[#101518] border-[#d5dce2]"
                onClick={() => document.getElementById("cover-upload").click()}
              >
                {coverPreview ? "Change Cover" : "Choose Cover File"}
              </Button>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-6">
            <h2 className="text-[#101518] text-xl font-semibold mb-6">
              Company Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#101518] font-medium">
                  Company Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter company name *"
                  {...register("name")}
                  className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                />
                {errors.name ? (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                ) : (
                  <p className="text-sm text-[#5c758a]">Minimum 2 characters required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-[#101518] font-medium">
                  Company Size *
                </Label>
                <Select onValueChange={(value) => setValue("size", value)}>
                  <SelectTrigger className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518]">
                    <SelectValue placeholder="Select company size *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {errors.size ? (
                  <p className="text-sm text-red-600">{errors.size.message}</p>
                ) : (
                  <p className="text-sm text-[#5c758a]">Please select a company size</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="industry"
                  className="text-[#101518] font-medium"
                >
                  Industry *
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance *"
                  {...register("industry")}
                  className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                />
                {errors.industry ? (
                  <p className="text-sm text-red-600">
                    {errors.industry.message}
                  </p>
                ) : (
                  <p className="text-sm text-[#5c758a]">Minimum 2 characters required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-[#101518] font-medium"
                >
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA *"
                  {...register("location")}
                  className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                />
                {errors.location ? (
                  <p className="text-sm text-red-600">
                    {errors.location.message}
                  </p>
                ) : (
                  <p className="text-sm text-[#5c758a]">Required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-[#101518] font-medium">
                  Website *
                </Label>
                <Input
                  id="website"
                  placeholder="https://www.example.com *"
                  {...register("website")}
                  className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                />
                {errors.website ? (
                  <p className="text-sm text-red-600">
                    {errors.website.message}
                  </p>
                ) : (
                  <p className="text-sm text-[#5c758a]">Must be a valid URL</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="foundedYear"
                  className="text-[#101518] font-medium"
                >
                  Founded Year *
                </Label>
                <Input
                  id="foundedYear"
                  placeholder="e.g., 2020 *"
                  type="number"
                  {...register("foundedYear", {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                  className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                />
                {errors.foundedYear ? (
                  <p className="text-sm text-red-600">
                    {errors.foundedYear.message}
                  </p>
                ) : (
                  <p className="text-sm text-[#5c758a]">Must be between 1950 and current year</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[#101518] font-medium"
              >
                Company Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Tell us about your company, its mission, values, and what makes it unique... *"
                {...register("description")}
                className="min-h-32 resize-none bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
              />
              <div className="flex justify-between items-center">
                {errors.description ? (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                ) : (
                  <p className="text-sm text-[#5c758a]">
                    Minimum 10 characters required
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[#101518] font-medium">
                Social Media Links (Optional)
              </Label>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm text-[#5c758a]">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/company/..."
                    {...register("socialLinks.linkedin")}
                    className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                  />
                  {errors.socialLinks?.linkedin && (
                    <p className="text-sm text-red-600">
                      {errors.socialLinks.linkedin.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm text-[#5c758a]">
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/..."
                    {...register("socialLinks.twitter")}
                    className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                  />
                  {errors.socialLinks?.twitter && (
                    <p className="text-sm text-red-600">
                      {errors.socialLinks.twitter.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="text-sm text-[#5c758a]">
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/..."
                    {...register("socialLinks.github")}
                    className="h-11 bg-gray-50 border-[#d5dce2] text-[#101518] placeholder:text-[#5c758a]"
                  />
                  {errors.socialLinks?.github && (
                    <p className="text-sm text-red-600">
                      {errors.socialLinks.github.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              size="lg"
              className="px-8 bg-[#eaeef1] text-[#101518] hover:bg-[#d5dce2]"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating Company..." : "Create Company"}
            </Button>
          </div>
        </form>

        {/* Image Crop Modal */}
        <ImageCropModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          imageSrc={imageSrc}
          type={cropType}
          onCropCompleteAction={onCropComplete}
        />
      </div>
    </div>
  );
};

export default CreateCompany;
