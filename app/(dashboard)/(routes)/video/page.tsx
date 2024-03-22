"use client";

import * as z from "zod";
import Heading from "@/components/heading";
import { MessageSquare, VideoIcon } from "lucide-react";

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

const VideoPage = () => {
  const router = useRouter();

  const [video, setVideos] = useState<string>();

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
      setVideos(undefined);
      // making an api call with the message begin the new message array.
      const response = await axios.post("/api/video", values);

      setVideos(response.data[0]);

      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Use text prompt to create stunning videos."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                        placeholder="Clown fish swimming around a coral reef."
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
          <div className="flex flex-col-reverse gap-y-4">
          {!video && !isLoading && (
            <Empty label="No Video Generated" />
          )}
          {video && (
            <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
              <source src={video}/>
            </video>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
