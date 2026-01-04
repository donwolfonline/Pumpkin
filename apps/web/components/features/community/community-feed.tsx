"use client";

import { useEffect, useState } from 'react';
import { api, CommunityPost, User } from '@/lib/api';
import { PostCard } from './post-card';
import { CreatePost } from './create-post';
import { Loader2, Zap } from 'lucide-react';

interface CommunityFeedProps {
    user: User | null;
}

export function CommunityFeed({ user }: CommunityFeedProps) {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadPosts = async () => {
        try {
            const data = await api.getCommunityPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to load community posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Cultivating Feed...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-white glow-emerald mb-4">Community Hub</h1>
                <p className="text-zinc-400 text-lg">
                    Join the conversation. Grow together with other service pros.
                </p>
            </div>

            {user ? (
                <CreatePost user={user} onPostCreated={loadPosts} />
            ) : (
                <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 mb-12 text-center group transition-all hover:bg-primary/10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 font-heading">Join the Harvest</h3>
                    <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
                        Sign up or login to share your wisdom and connect with other service businesses.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <a
                            href="/register"
                            className="bg-primary text-black font-bold h-12 px-8 rounded-xl flex items-center transition-all hover:scale-105"
                        >
                            Get Started
                        </a>
                        <a
                            href="/login"
                            className="bg-white/5 border border-white/10 text-white font-bold h-12 px-8 rounded-xl flex items-center transition-all hover:bg-white/10"
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} currentUser={user} onUpdate={loadPosts} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-white/5 rounded-[2rem]">
                        <p className="text-zinc-600 uppercase tracking-[0.2em] font-bold text-xs">The soil is quiet. <br />Be the first to plant a seed!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
