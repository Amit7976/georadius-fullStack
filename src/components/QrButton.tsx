"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { t } from "../helpers/i18n";

const QrButton = ({ postId }: { postId: string }) => {
    const [open, setOpen] = useState(false);
    const shareUrl = `${window.location.origin}/news/${postId}`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-3 w-full p-3 h-12 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <QrCode className="size-5" /> {t("makeQR")}
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col items-center p-12 bg-transparent dark:bg-transparent">
                <DialogHeader className={"relative"}>
                    <DialogTitle className="text-lg font-semibold text-center">{t("scanToView")}</DialogTitle>
                </DialogHeader>
                <div className="border-4 p-2 rounded-sm">
                    <QRCodeSVG value={shareUrl} size={300} />
                </div>
                <p className="text-sm text-gray-500 mt-2">{t("scanQRDesc")}</p>
            </DialogContent>
        </Dialog>
    );
};

export default QrButton;
