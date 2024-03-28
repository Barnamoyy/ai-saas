import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
const DashboardLayout = async ({children} : {children: React.ReactNode}) => {

    // running the api limit count in server component 
    const apiLimitCount = await getApiLimitCount();
 
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md-flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 ">
                <div>
                    {/* content for sidebar */}
                    <Sidebar apiLimitCount={apiLimitCount} />
                </div>
            </div>
            <main className="md:pl-72">
                <Navbar />
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;