"use client";

import { useState } from 'react';
import { Send, Sparkles, Image as ImageIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, User } from '@/lib/api';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import { cn } from '@/lib/utils';

interface CreatePostProps {
    user: User;
    onPostCreated: () => void;
}

export function CreatePost({ user, onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(true);
    const { toast } = usePumpkinToast();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) return toast("File too large (max 1MB)", 'error');
            const reader = new FileReader();
            reader.onloadend = () => setImageUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !imageUrl) return;

        setIsSubmitting(true);
        try {
            await api.createCommunityPost({
                content,
                type: 'POST',
                imageUrl: imageUrl || undefined,
                isPublic
            });
            setContent('');
            setImageUrl(null);
            onPostCreated();
            toast('Your post is now live in the community!', 'success');
        } catch (error) {
            toast('Failed to create post. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 mb-8 group transition-all hover:border-emerald-500/20">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl overflow-hidden shrink-0">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{user.firstName[0]}</span>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's growing in your business?"
                        className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-500 resize-none min-h-[80px] text-lg mt-2"
                    />

                    {imageUrl && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group/img">
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setImageUrl(null)}
                                className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                                <Sparkles className="w-3 h-3 hover:text-red-400" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-2">
                            <input
                                type="file"
                                id="post-image"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => document.getElementById('post-image')?.click()}
                                className={cn("text-zinc-500 hover:text-emerald-400", imageUrl && "text-emerald-400 bg-emerald-400/10")}
                            >
                                <ImageIcon className="w-5 h-5" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsPublic(!isPublic)}
                                className={cn("text-zinc-500 hover:text-emerald-400", !isPublic && "text-orange-400 bg-orange-400/10")}
                                title={isPublic ? "Public" : "Private"}
                            >
                                <Globe className="w-5 h-5" />
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={(!content.trim() && !imageUrl) || isSubmitting}
                            className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold rounded-xl px-6"
                        >
                            {isSubmitting ? 'Posting...' : 'Share Post'}
                            <Send className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
