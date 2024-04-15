"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModalStore } from "@/hooks/use-pro-modal";

interface counterProps {
  apiLimitCounter: number;
}

const FreeCounter = ({ apiLimitCounter = 0 }: counterProps) => {
  const proModel = useProModalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center tet-sm mb-4 text-white space-y-2">
            <p>
              {apiLimitCounter} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCounter / MAX_FREE_COUNTS) * 100}
            />
          </div>
          <Button onClick={proModel.openModal} className="w-full" variant="gradient">
            Upgrade <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
