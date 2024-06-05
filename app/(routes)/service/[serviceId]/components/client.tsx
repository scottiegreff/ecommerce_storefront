"use client";

import { useState, useEffect } from "react";
import CustomerForm from "@/components/customer-form";
import BookingForm from "@/components/booking-form";

const ServiceClient = () => {
  const [customerId, setCustomerId] = useState("");
  const handleValueChange = (value: string) => {
    setCustomerId(value);
  };

  useEffect(() => {
    const customerId = localStorage.getItem("customer_id");
    if (customerId) {
      setCustomerId(customerId);
    }
  }, [customerId]);

  return (
    <>
      <div>
        {!customerId ? (
          <CustomerForm onValueChange={handleValueChange} />
        ) : (
          <BookingForm />
        )}
      </div>
    </>
  );
};

export default ServiceClient;
