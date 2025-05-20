"use client"
import { purgeData } from "@/app/actions/purgeData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

        if (response === 200) {
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="dark text-white w-fit">Delete all data</Button>
                    </DialogTrigger>
                    <DialogContent className="dark text-white">
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>This action is permenant, and is irreversible. Data deleted from MODDR will not be able to be recovered.</DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="dark text-white">Go back</Button>
                            </DialogClose>
                            <Button variant="destructive" className="dark text-white" onClick={() => deleteAllData()}>Delete data</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-col gap-1 p-6">
                <h1 className={`${geistSans.className} text-white font-bold text-xl`}>How your data is stored</h1>
                <span className={`${geistSans.className} text-zinc-400 font-normal text-sm`}>
                    Your MODDR data is stored in accordance with ENDR's <a href="https://endr.tech/legal/privacy" className="text-blue-400 hover:underline hover:text-blue-600">Privacy Policy</a>.
                    <br />
                    Message and guild event activity is encrypted in transit to our database, and un-encrypted by you. No one, including ENDR can access your guild event and message data in any way, unless you explicitly request a copy of the data stored.
                    <br /><br />
                    Most data stored in our systems is gathered from Discord API data that is marked as generally available, subject to specific conditions.
                    <br />
                    Your message content data will never be used to:
                    <br /><br />
                    - Train, or improve the use of our AI models;<br />
                    - For targeted advertising purposes;<br />
                    - For internal use;<br />
                    - Or, to be used for malicious intent, such as targeted abuse.
                    <br /><br />
                    <b>ENDR Intelligence</b> - our AI platform, is provided by OpenAI's API. Data sent to OpenAI is never stored on their servers, and is only stored <b>within your session.</b>
                    <br />
                    Data provided to the models utilised by ENDR are not utilised to train the models, unless explicit consent is provided by all parties (ENDR, and you as the consumer).
                    <br />
                    If you have further questions regarding how we store your data, please contact our support team at info@mymod.endr.tech, or in our Discord server.
                </span>
            </div>
        </div>
    );
}