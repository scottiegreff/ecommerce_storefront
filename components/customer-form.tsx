"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";

const custFormSchema = z.object({
  custFName: z.string().min(2),
  custLName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
});

type CustFormValues = z.infer<typeof custFormSchema>;

interface CustomerFormProps {
  onValueChange: (value: string) => void;
}
// }

const CustomerForm: React.FC<CustomerFormProps> = ({ onValueChange }) => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const custToastMessage = "You are a Customer.";
  const custAction = "Submit";

  const custForm = useForm<CustFormValues>({
    resolver: zodResolver(custFormSchema),
    defaultValues: {
      custFName: "",
      custLName: "",
      email: "",
      phone: "",
    },
  });

  const onCustSubmit = async (data: CustFormValues) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      // setCustomerId(responseData.id); // Set the customerId to the response data id
      localStorage.setItem("customerId", responseData.id);
      setCustomerId(responseData.id);
      onValueChange(responseData.id);
      toast.success(custToastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Retrieve the stored value from localStorage
    const stored = localStorage.getItem("customerId");
    if (stored) {
      setCustomerId(stored);
    }
  }, []);

  return (
    <>
      <h2 className="text-2xl text-center font-bold text-gray-800">Customer</h2>
      <p className="pt-2  pb-3 text-sm md:text-md font-light text-gray-800">
        * Create a customer profile, to book a service.
      </p>
      <Separator />
      {/* CUSTOMER FORM */}
      <Form {...custForm}>
        <form
          onSubmit={custForm.handleSubmit(onCustSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8">
            {/* CUSTOMER FIRST NAME */}
            <FormField
              control={custForm.control}
              name="custFName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-light">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CUSTOMER LAST NAME */}
            <FormField
              control={custForm.control}
              name="custLName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-light">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CUSTOMER EMAIL */}
            <FormField
              control={custForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-light">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CUSTOMER PHONE */}
            <FormField
              control={custForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-light">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center items-center">
            <Button
              disabled={loading}
              className="py-6 mt-10 w-[20vw] md:text-lg text-white bg-slate-700 shadow-lg"
              type="submit"
            >
              {custAction}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default CustomerForm;
