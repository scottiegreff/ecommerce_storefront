"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const formSchema = z.object({
  custFName: z.string().min(2),
  custLName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  onValueChange: (value: string) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onValueChange }) => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);
  const [customerEmail, setCustomerEmail] = useState<string | undefined>();
  const [customerConfirmEmail, setCustomerConfirmEmail] = useState<
    string | undefined
  >();

  const [loading, setLoading] = useState(false);

  const toastMessage = "You are a Customer.";
  const action = "Submit";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      custFName: "",
      custLName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.custFName) {
      toast.error("First Name is required.");
      return;
    }
    if (!data.custLName) {
      toast.error("Last Name is required.");
      return;
    }
    if (!data.email) {
      toast.error("Email is required.");
      return;
    }
    data.email = data.email.toLowerCase();
    data.email = data.email.trim();
    data.email = data.email.replace(/\s/g, "");

    if (data.email !== customerConfirmEmail) {
      toast.error("Emails do not match.");
      return;
    }

    if (!data.phone) {
      toast.error("Phone is required.");
      return;
    }

    try {
      setLoading(true);
      const URL = `${process.env.NEXT_PUBLIC_API_URL}/customers`;
      const response = await fetch(URL, {
        method: "POST",
        // headers: {
        //   "Content-Type": "text/plain;charset=UTF-8",
        //   Accept: "*/*",
        //   Origin: "https://www.prisoneroflovestudio.com",
        // },
        body: JSON.stringify(data),
        // redirect: "follow", // Ensures the redirect is followed,
      })
        .then((response) => response)
        .catch((error) => {
          throw new Error(error);
        });
      const responseData = await response.json();

      // setCustomerId(responseData.id); // Set the customerId to the response data id
      localStorage.setItem("customerId", responseData.id);
      localStorage.setItem("customerEmail", responseData.email);
      setCustomerId(responseData.id);
      onValueChange(responseData.id);
      toast.success(toastMessage);
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
      <h2 className="text-2xl text-center font-bold text-[#C68DBA]">
        Customer
      </h2>
      <p className="pt-2 pb-7 text-center text-sm md:text-md font-md text-[#ffffff]">
        * To book a service, create a customer profile.
      </p>
      <Separator />
      {/* CUSTOMER FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full text-[#C68DBA]"
        >
          <div className="md:grid md:grid-cols-2 gap-8 ">
            {/* CUSTOMER FIRST NAME */}
            <FormField
              control={form.control}
              name="custFName"
              render={({ field }) => (
                <FormItem className="my-3 md:my-0 text-[#C68DBA]">
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
              control={form.control}
              name="custLName"
              render={({ field }) => (
                <FormItem className="my-3 md:my-0">
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
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-3 md:my-0">
                  <FormLabel className="text-md font-light">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="my-3 md:my-0">
              <Label className="text-md font-light" htmlFor="">
                Confirm Email
              </Label>

              <Input
                className="mt-2"
                type="email"
                id="email"
                placeholder="Confirm Email"
                onChange={(e) =>
                  setCustomerConfirmEmail(e.target.value.toLowerCase())
                }
              />
            </div>
            {/* CUSTOMER PHONE */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-3 md:my-0">
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
              className="py-6 mt-10 w-[20vw] md:text-lg text-white border border-white bg-[#C68DBA] shadow-lg"
              type="submit"
            >
              {action}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default CustomerForm;
