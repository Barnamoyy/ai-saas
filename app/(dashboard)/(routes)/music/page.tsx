"use client";

import * as z from "zod";
import Heading from "@/components/heading";
import { MessageSquare, Music } from "lucide-react";
import {toast} from "react-hot-toast"; 

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";


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
import { useProModalStore } from "@/hooks/use-pro-modal";


const MusicPage = () => {

  const proModal = useProModalStore();

  const router = useRouter();

  const [music, setMusic] = useState<string>(
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
      setMusic(undefined);
     
      // making an api call with the message begin the new message array.
      const response = await axios.post("/api/music", values);
      setMusic(response.data.audio);
      
      form.reset();
    } catch (error:any) {
      if(error?.response?.status === 403){
        proModal.openModal();
      }
      else {
        toast.error("Something went wrong.");
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Generate groovy music using text prompt."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                        placeholder="Piano solo"
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
          {!music && !isLoading && (
            <Empty label="No Music Generated" />
          )}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music}/>
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
