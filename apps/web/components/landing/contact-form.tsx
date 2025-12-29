"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { usePumpkinToast } from "@/components/ui/pumpkin-toast";

export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
    const { toast } = usePumpkinToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        toast("Request sent! We'll be in touch shortly.", "success");
        setFormData({ name: "", email: "", company: "", message: "" });
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Name</Label>
                    <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black/40 border-white/10"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-black/40 border-white/10"
                        placeholder="john@example.com"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Company (Optional)</Label>
                <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-black/40 border-white/10"
                    placeholder="Acme Inc."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Message</Label>
                <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-black/40 border-white/10 min-h-[100px]"
                    placeholder="Tell us about your needs..."
                />
            </div>

            <DialogFooter className="mt-6">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Request Demo"}
                </Button>
            </DialogFooter>
        </form>
    );
}
