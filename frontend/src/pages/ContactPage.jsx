import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  Hash,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { submitContactForm } from "@/api/dashboardApi";

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactForm(contactForm);
      toast.success("Thank you for your message! We'll get back to you soon.");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit the contact form."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <h1 className="text-[#111518] tracking-light text-[32px] font-bold leading-tight">
              Contact Us
            </h1>
            <p className="text-[#5d7589] text-sm font-normal leading-normal">
              We're here to help! Reach out to us with any questions or
              feedback.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <Input
                name="name"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={handleInputChange}
                className="border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5d7589] p-4 text-base font-normal leading-normal rounded-xl"
                required
              />
            </label>
          </div>

          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={handleInputChange}
                className="border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5d7589] p-4 text-base font-normal leading-normal rounded-xl"
                required
              />
            </label>
          </div>

          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <Input
                name="subject"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                className="border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5d7589] p-4 text-base font-normal leading-normal rounded-xl"
                required
              />
            </label>
          </div>

          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <Textarea
                name="message"
                placeholder="Your Message"
                value={contactForm.message}
                onChange={handleInputChange}
                className="border-none bg-[#eaedf1] focus:border-none min-h-36 placeholder:text-[#5d7589] p-4 text-base font-normal leading-normal rounded-xl resize-none"
                required
              />
            </label>
          </div>

          <div className="flex px-4 py-3 justify-start">
            <Button
              type="submit"
              className="min-w-[84px] max-w-[480px] h-10 px-4 bg-[#c9dcec] hover:bg-[#b8d0e8] text-[#111518] text-sm font-bold rounded-full"
            >
              Submit
            </Button>
          </div>
        </form>

        {/* Contact Information */}
        <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Other Ways to Reach Us
        </h3>

        <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2">
          <div className="text-[#111518] flex items-center justify-center rounded-lg bg-[#eaedf1] shrink-0 size-12">
            <Mail size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#111518] text-base font-medium leading-normal line-clamp-1">
              Email
            </p>
            <p className="text-[#5d7589] text-sm font-normal leading-normal line-clamp-2">
              support@careerconnect.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2">
          <div className="text-[#111518] flex items-center justify-center rounded-lg bg-[#eaedf1] shrink-0 size-12">
            <Phone size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#111518] text-base font-medium leading-normal line-clamp-1">
              Phone
            </p>
            <p className="text-[#5d7589] text-sm font-normal leading-normal line-clamp-2">
              +91 98765 43210
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2">
          <div className="text-[#111518] flex items-center justify-center rounded-lg bg-[#eaedf1] shrink-0 size-12">
            <Hash size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#111518] text-base font-medium leading-normal line-clamp-1">
              Social Media
            </p>
            <p className="text-[#5d7589] text-sm font-normal leading-normal line-clamp-2">
              Follow us on social media for updates and news.
            </p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="@container">
          <div className="gap-2 px-4 flex flex-wrap justify-start">
            <div className="flex flex-col items-center gap-2 bg-gray-50 py-2.5 text-center w-20">
              <div className="rounded-full bg-[#eaedf1] p-2.5">
                <div className="text-[#111518]">
                  <Twitter size={20} />
                </div>
              </div>
              <p className="text-[#111518] text-sm font-medium leading-normal">
                Twitter
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-gray-50 py-2.5 text-center w-20">
              <div className="rounded-full bg-[#eaedf1] p-2.5">
                <div className="text-[#111518]">
                  <Facebook size={20} />
                </div>
              </div>
              <p className="text-[#111518] text-sm font-medium leading-normal">
                Facebook
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-gray-50 py-2.5 text-center w-20">
              <div className="rounded-full bg-[#eaedf1] p-2.5">
                <div className="text-[#111518]">
                  <Instagram size={20} />
                </div>
              </div>
              <p className="text-[#111518] text-sm font-medium leading-normal">
                Instagram
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-gray-50 py-2.5 text-center w-20">
              <div className="rounded-full bg-[#eaedf1] p-2.5">
                <div className="text-[#111518]">
                  <Linkedin size={20} />
                </div>
              </div>
              <p className="text-[#111518] text-sm font-medium leading-normal">
                LinkedIn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
