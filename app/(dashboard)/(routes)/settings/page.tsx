import Heading from "@/components/heading";
import { SubscriptionButton } from "@/components/subscripiton_button";
import { checkSubscription } from "@/lib/subscription";
import { SettingsIcon } from "lucide-react";

const Settings = async () => {
    const isPro = await checkSubscription(); 
    return (
        <div>
            <Heading 
                title="Settings"
                description="Manage your account settings"
                icon={SettingsIcon}
                iconColor="text-grey-700"
                bgColor="bg-black-700/10"
            />
            <div className="px-4 lg:px-8 space-y-4">
                <div className="text-muted-foreground text-sm ">
                    {isPro ? "you are currently on a Pro plan" : "you are currently on a Free plan"}
                </div>
                <SubscriptionButton isPro={isPro}/>
            </div>  
        </div>
    );
}

export default Settings;