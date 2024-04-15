"use client";

// shadcn dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "./ui/card";

import { useProModalStore } from "@/hooks/use-pro-modal";

// icons 
import { Check, Code, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const tools = [
    {
      label: "Conversation", 
      icon: MessageSquare,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      href: "/conversation"
    },
    {
      label: "Music Generation", 
      icon: Music,
      color: "text-emrald-500",
      bg: "bg-emrald-500/10",
      href: "/music"
    },
    {
      label: "Image Generation", 
      icon: ImageIcon,
      color: "text-pink-700",
      bg: "bg-pink-700/10",
      href: "/image"
    },
    {
      label: "Video Generation", 
      icon: VideoIcon,
      color: "text-orange-700",
      bg: "bg-orange-700/10",
      href: "/video"
    },
    {
      label: "Code Generation", 
      icon: Code,
      color: "text-green-700",
      bg: "bg-green-700/10",
      href: "/code"
    },
  ]

const ProModal = () => {
  const proModal = useProModalStore();

  return (
    <div>
      <Dialog open={proModal.isOpen} onOpenChange={proModal.closeModal}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
              <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center justify-center gap-x-2">
                Upgrade to genius
                <Badge className="uppercase text-sm py-1">Pro</Badge>
            </div>
              </DialogTitle>
            <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                {tools.map((tool) => (
                    <Card
                    key={tool.label}
                    className="flex items-center justify-between border-black/5 p-3">
                        <div className="flex items-center gap-x-4">
                            <div className={cn("p-2 w-fit rounded-md", tool.bg)}>
                                <tool.icon className={cn("w-6 h-6", tool.color)}/>
                            </div>
                            <div className="text-sm font-semibold">
                                {tool.label}
                            </div>
                        </div>
                        <Check />
                    </Card>
                ))}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
                size={'lg'}
                variant='gradient'
                className="w-full"
            >
                Upgrade
                <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProModal;
