"use client";

import { useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { logMeeting } from "@/app/actions/logMeeting";
import Spinner from "@/components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formSchema = z.object({
  newFirstName: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  meetingDate: z.date(),
  duration: z.number(),
  outcome: z.enum(["SCHEDULED", "COMPLETED", "NO_SHOW", "CANCELED"]),
});

type FormValues = z.infer<typeof formSchema>;

export function LogMeetingForm({
  contactId,
  contactFirstName, // ✅ New prop
  onSuccess,
}: {
  contactId: string;
  contactFirstName?: string; // ✅ Optional
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newFirstName: contactFirstName || "", // ✅ Pre-fill contact name
      title: "",
      body: `Met with [Name] at [Store Name].

Topics discussed:
- 
- 

Store traffic:
Next steps:`,
      meetingDate: new Date(),
      duration: 30,
      outcome: "SCHEDULED",
    },
  });

  const onSubmit = (values: FormValues) => {
    const endDate = new Date(
      values.meetingDate.getTime() + values.duration * 60000
    );

    startTransition(() => {
      logMeeting({
        contactId,
        title: values.title,
        body: values.body,
        meetingDate: values.meetingDate.toISOString(),
        endDate: endDate.toISOString(),
        outcome: values.outcome,
        newFirstName: values.newFirstName,
      })
        .then(() => {
          toast.success("Meeting logged!");
          form.reset();
          onSuccess?.();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to log meeting");
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact's First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Notes</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Date & Time</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  showTimeSelect
                  timeIntervals={10}
                  timeFormat="HH:mm"
                  dateFormat="yyyy-MM-dd h:mm aa"
                  className="w-full rounded border px-3 py-2 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <select
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {[15, 30, 45, 60].map((min) => (
                    <option key={min} value={min}>
                      {min} minutes
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outcome</FormLabel>
              <FormControl>
                <select
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800"
                  {...field}
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="NO_SHOW">No Show</option>
                  <option value="CANCELED">Canceled</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-1">
              <Spinner size="4" />
              Submitting
            </div>
          ) : (
            "Log Meeting"
          )}
        </Button>
      </form>
    </Form>
  );
}
