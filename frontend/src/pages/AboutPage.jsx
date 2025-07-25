import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Handshake, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const AboutPage = () => {
  const [contactForm, setContactForm] = useState({
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    toast.success("Thank you for your message! We'll get back to you soon.");
    setContactForm({ email: "", message: "" });
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
          <h1 className="text-[#111518] tracking-tight text-[32px] font-bold leading-tight min-w-72">
            About CareerConnect
          </h1>
        </div>

        <p className="text-[#111518] text-base font-normal leading-normal pb-3 pt-1 px-4">
          CareerConnect is a leading job board platform dedicated to connecting
          talented professionals with innovative companies. Our mission is to
          empower individuals to find fulfilling careers and help organizations
          build exceptional teams. We believe in transparency, inclusivity, and
          providing equal opportunities for all.
        </p>

        <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Our Mission
        </h2>
        <p className="text-[#111518] text-base font-normal leading-normal pb-3 pt-1 px-4">
          At CareerConnect, we strive to create a seamless and efficient job
          search experience. We are committed to providing job seekers with
          access to a wide range of opportunities and resources to help them
          succeed in their career journeys. For employers, we offer powerful
          tools to attract, engage, and hire top talent.
        </p>

        <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Our Values
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          <div className="flex flex-1 gap-3 rounded-lg border border-[#d5dce2] bg-gray-50 p-4 flex-col">
            <div className="text-[#111518]">
              <Users size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[#111518] text-base font-bold leading-tight">
                People First
              </h3>
              <p className="text-[#5d7589] text-sm font-normal leading-normal">
                We prioritize the needs of our users, both job seekers and
                employers.
              </p>
            </div>
          </div>

          <div className="flex flex-1 gap-3 rounded-lg border border-[#d5dce2] bg-gray-50 p-4 flex-col">
            <div className="text-[#111518]">
              <Handshake size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[#111518] text-base font-bold leading-tight">
                Collaboration
              </h3>
              <p className="text-[#5d7589] text-sm font-normal leading-normal">
                We believe in the power of teamwork and open communication.
              </p>
            </div>
          </div>

          <div className="flex flex-1 gap-3 rounded-lg border border-[#d5dce2] bg-gray-50 p-4 flex-col">
            <div className="text-[#111518]">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[#111518] text-base font-bold leading-tight">
                Integrity
              </h3>
              <p className="text-[#5d7589] text-sm font-normal leading-normal">
                We uphold the highest standards of ethics and transparency.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Meet the Team
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          <div className="flex flex-col gap-3 text-center pb-3">
            <div className="px-4">
              <img
                src="https://res.cloudinary.com/drxs8mnvl/image/upload/v1753434110/bunny_d8sqzq.jpg"
                alt="Avinash Reddy"
                className="w-full aspect-square rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#111518] text-base font-medium leading-normal">
                Avinash Reddy
              </p>
              <p className="text-[#5d7589] text-sm font-normal leading-normal">
                CEO
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-center pb-3">
            <div className="px-4">
              <img
                src="https://res.cloudinary.com/drxs8mnvl/image/upload/v1753434109/puli_a9hpr3.jpg"
                alt="Madhav Chundi"
                className="w-full aspect-square rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#111518] text-base font-medium leading-normal">
                Madhav Chundi
              </p>
              <p className="text-[#5d7589] text-sm font-normal leading-normal">
                CTO
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-center pb-3">
            <div className="px-4">
              <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                ER
              </div>
            </div>
            <div>
              <p className="text-[#111518] text-base font-medium leading-normal">
                Praveen Ramisetty
              </p>
              <p className="text-[#5d7589] text-sm font-normal leading-normal">
                Head of Marketing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
