"use client";

import * as z from "zod";
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { cn } from "@/lib/utils";

import { formSchema } from "./constants";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

// import { ChatCompletionMessageParam } from "openai/resources/chat";
import type { OpenAI } from "openai";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { useProModalStore } from "@/hooks/use-pro-modal";

const ConversationPage = () => {

  const proModal = useProModalStore(); 

  const router = useRouter();

  const [messages, setMessages] = useState<OpenAI.ChatCompletionMessageParam[]>(
    []
  );

  // form schema's kept in constants file.

  // creating form functions
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // loading state
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // created a new user message thta takes name user and value of the input field
      const userMessage: OpenAI.ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };

      // appended this user message to the new message array that contains all the old messages as well
      const newMessages = [...messages, userMessage];

      // making an api call with the message begin the new message array.
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error) {
      proModal.openModal();
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation A.I yet."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          {/* {...form} is used to pass all functions of form as props instead of manually adding */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                                rounded-lg
                                border 
                                w-full
                                p-4
                                px-3
                                md:px-6
                                focus-within:shadow-md
                                grid
                                grid-cols-12
                                gap-2
                            "
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      {/* disable property passed when the form is loading */}
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        placeholder="How do I calculate the electromagnetic field?"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 m-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No Conversation Started" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message: OpenAI.ChatCompletionMessageParam) => (
              <div
                key={message.content as string}
                className={cn(
                  "p-8 w-full rounded-lg flex items-start gap-x-8",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
