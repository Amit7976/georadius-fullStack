"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

const QrButton = ({ postId }: { postId: number }) => {
    const [open, setOpen] = useState(false);
    const shareUrl = `${window.location.origin}/news/${postId}`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={100} variant="ghost" className="flex gap-3 w-full p-3 text-lg cursor-pointer justify-start rounded-md text-gray-700 hover:bg-gray-100">
                    <QrCode className="size-5" /> Make QR
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col items-center p-6">
                <DialogHeader className={"relative"}>
                    <DialogTitle className="text-lg font-semibold text-center">Scan to View Post</DialogTitle>
                </DialogHeader>
                <QRCodeSVG value={shareUrl} size={200} />
                <p className="text-sm text-gray-500 mt-2">Scan this QR code to open the post.</p>
            </DialogContent>
        </Dialog>
    );
};

export default QrButton;
