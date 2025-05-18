"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();

    return (
        <div className={cn("h-fit flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden h-fit">
                <CardContent className="p-2">
                    <form className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back!</h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your ENDR ID to continue.
                                </p>
                            </div>
                            <Button type="submit" className="w-full" onClick={() => router.push(`${process.env.NEXT_PUBLIC_DEV_MODE === "true" ? "http" : "https"}://${process.env.NEXT_PUBLIC_ENDR_ID_AUTH_URL}/oauth/authorize?clientId=${process.env.NEXT_PUBLIC_ENDR_ID_APP_ID}`)}>
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="https://endr.tech/legal/terms">Terms of Service</a>{" "}
                and <a href="https://endr.tech/legal/privacy">Privacy Policy</a>.
            </div>
        </div>
    )
}
