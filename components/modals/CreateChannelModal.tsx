"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  createChannel,
  createServer,
  editServer,
} from "@/lib/actions/server.action";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

enum ChannelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Too short")
    .max(100, "Too long")
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "createChannel";
  const router = useRouter();
  const params = useParams();
  const { channelType } = data;

  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType as ChannelType);
    } else {
      form.setValue("type", ChannelType.TEXT);
    }
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await createChannel({
        ...values,
        serverId: params?.id as any,
      });
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleModalClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Create A New Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter channel name"
                      disabled={isLoading}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-300/50 border-0 from-ring text-black ring-offset-0 focus-visible:ring-0 outline-none">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ChannelType).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <FormMessage />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="bg-gray-100 px-6 py-6">
              <Button type="submit" variant="primary" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
