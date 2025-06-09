"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { t } from "../helpers/i18n";

export default function DeleteAccountDialog() {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        window.location.href = "/pages/auth/signin";
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/deleteAccount", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || t("somethingWrong"));
                handleLogout();
                return;
            }

            toast.success(t("accountDeleted"));
            handleLogout();
        } catch (err) {
            console.error("Error:", err);
            toast.error(t("somethingWrong"));
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    // Countdown effect when checkbox is clicked
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (confirmed && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [confirmed, countdown]);

    const handleCheckboxClick = () => {
        if (!confirmed) {
            setConfirmed(true);
            setCountdown(10);
        } else {
            // Allow unchecking to cancel countdown and reset
            setConfirmed(false);
            setCountdown(0);
        }
    };

    const isDeleteButtonEnabled = countdown === 0 && confirmed;

    return (
        <>
            <div className="flex items-start space-x-3 mt-12">
                <Checkbox
                    className="w-6 h-6 mt-2"
                    id="confirm-delete"
                    onClick={handleCheckboxClick}
                    checked={confirmed}
                />
                <label
                    htmlFor="confirm-delete"
                    className="text-lg font-semibold text-red-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {t("deleteWarning")}
                </label>
            </div>

            {confirmed && countdown > 0 && (
                <p className="text-sm text-red-600 mt-2">
                    {t("deletingIn")} <strong>{countdown}</strong> {t("cancelDelete")} <br />
                    <em>{t("irreversible")}</em>
                </p>
            )}

            <Button
                variant="destructive"
                className="w-full bg-red-500 active:bg-red-400 duration-300 h-16 text-white text-lg font-bold rounded-lg mt-4"
                onClick={() => setOpen(true)}
                disabled={!isDeleteButtonEnabled}
            >
                {t("deleteAccountTitle")}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={"bg-red-500 border-red-500 rounded-3xl"}>
                    <DialogHeader className={"py-5"}>
                        <DialogTitle className="text-xl text-start text-white">
                            {t("enterPasswordToDelete")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder={t("enterPassword")}
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const noSpaces = e.target.value.replace(/\s/g, "");
                                setPassword(noSpaces);
                            }}
                            className="w-full h-16 bg-white border-white tracking-wide text-xl px-5 font-medium"
                        />

                    </div>

                    <DialogFooter className="my-4">
                        <Button
                            onClick={handleDelete}
                            disabled={loading || password.length === 0}
                            className="w-full bg-red-800 active:bg-red-800 duration-300 h-16 text-white text-lg font-bold rounded-lg"
                        >
                            {loading ? t("deleting") : t("deleteAccountBtn")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
