"use client"
import { purgeData } from "@/app/actions/purgeData";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useServerStore } from "@/lib/store/useLoadingStore";
import { Geist } from "next/font/google";
import { toast } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export default function EnableFeaturesSettings() {
    const serverId = useServerStore((state) => state.serverId);
    const deleteAllData = async () => {
        const response = await purgeData((serverId as string));

        if(response === 200) {
            toast.success("Data deleted.");
        } else {
            toast.error("There was an error deleting your data. If the issue persists, contact MODDR Support.")
        }
    }

    return (
        <div className="w-full h-full">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-0 p-2">
                    <h1 className={`${geistSans.className} text-white font-bold text-3xl`}>Security</h1>
                    <span className={`${geistSans.className} text-zinc-600 font-normal text-md`}>We don't gatekeep your data. Delete and manage all data stored by MODDR from here.</span>
                </div>
                <Separator />
            </div>
            <div className="flex flex-col gap-3 p-6">
                <h1 className={`${geistSans.className} text-white font-bold text-xl`}>Delete your MODDR data</h1>
                <span className={`${geistSans.className} text-zinc-600 font-normal text-sm`}>This feature allows you to delete all of your MODDR data, and is irreversible. You can use this feature if you need to clear any personal data, or if you want a fresh start in your dashboard.</span>
                <Button variant="destructive" className="dark text-white w-fit" onClick={() => deleteAllData()}>Delete all data</Button>
            </div>
        </div>
    );
}