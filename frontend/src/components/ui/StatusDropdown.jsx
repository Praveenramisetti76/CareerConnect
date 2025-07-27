import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

const StatusDropdown = ({ job, getStatusColor, onStatusChange }) => {
  const [open, setOpen] = useState(false);

  // Map status to display label
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "Active";
      case "closed":
        return "Closed";
      case "paused":
        return "Paused";
      case "draft":
        return "Draft";
      default:
        return "Active"; // Default to Active for undefined/null status
    }
  };

  const statusLabel = getStatusLabel(job.status);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Badge
        className={`${getStatusColor(job.status)} border-0 cursor-pointer`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {statusLabel}
      </Badge>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 10,
            minWidth: "100px",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              color: job.status === "active" ? "#0d151c" : "#49749c",
            }}
            onClick={() => {
              setOpen(false);
              onStatusChange("active");
            }}
            disabled={job.status === "active"}
          >
            Active
          </button>
          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              color: job.status === "closed" ? "#0d151c" : "#49749c",
            }}
            onClick={() => {
              setOpen(false);
              onStatusChange("closed");
            }}
            disabled={job.status === "closed"}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
