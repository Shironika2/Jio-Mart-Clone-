import React from "react";
import type { StepIndicatorProps } from "../../types";


export default function StepIndicator({ step }: StepIndicatorProps) {
  const steps = ["Order Review", "Delivery Address", "Payment"];

  return (
    <div className="d-flex justify-content-center my-4 flex-wrap">
      {steps.map((label, i) => {
        const current = i + 1;
        const active = current === step;
        const completed = current < step;

        // Green for active/completed steps
        const circleColor = completed ? "green" : active ? "green" : "gray";
        const bgClass = completed
          ? "bg-success text-white border-success"
          : active
          ? "text-white" // remove Bootstrap bg-primary
          : "border-secondary text-secondary";

        const circleStyle = {
          width: 32,
          height: 32,
          backgroundColor: active ? "green" : completed ? "green" : "white",
          borderColor: active ? "green" : completed ? "green" : "gray",
        };

        return (
          <div
            key={i}
            className="d-flex align-items-center mx-3 my-1"
            style={{ color: circleColor }}
          >
            <div
              className={`rounded-circle border d-flex justify-content-center align-items-center me-2 ${bgClass}`}
              style={circleStyle}
            >
              {current}
            </div>
            <strong>{label}</strong>
          </div>
        );
      })}
    </div>
  );
}
