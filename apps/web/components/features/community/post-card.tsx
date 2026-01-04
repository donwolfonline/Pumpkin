"use client";

import { useState } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, Sparkles, Send, Globe } from 'lucide-react';
import { CommunityPost, api, User } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PostCardProps {
    post: CommunityPost;
    currentUser: User | null;
    onUpdate: () => void;
}

export function PostCard({ post, currentUser, onUpdate }: PostCardProps) {
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const isAnnouncement = post.type === 'ANNOUNCEMENT';
    const isLiked = currentUser && post.likedBy?.includes(currentUser.id);

    const handleLike = async () => {
        if (!currentUser) return;
        try {
            await api.toggleCommunityPostLike(post.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to like:', error);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Post by ${post.author.firstName}`,
            text: post.content,
            url: `${window.location.origin}/community?post=${post.id}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setIsSubmittingComment(true);
        try {
            await api.addCommunityComment(post.id, commentContent);
            setCommentContent('');
            setIsCommenting(false);
            onUpdate();
        } catch (error) {
            console.error('Failed to comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className={cn(
            "bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden transition-all hover:border-white/10 mb-6",
            isAnnouncement && "border-primary/20 bg-primary/5 ring-1 ring-primary/20"
        )}>
            {isAnnouncement && (
                <div className="bg-primary/10 px-6 py-2 border-b border-primary/20 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Announcement</span>
                </div>
            )}

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
                            {post.author.avatar ? (
                                <img src={post.author.avatar} alt={post.author.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <span>{post.author.firstName[0]}</span>
                            )}
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm leading-none flex items-center gap-2">
                                {post.author.firstName} {post.author.lastName}
                                {post.author.role === 'super_admin' && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                                )}
                            </h4>
                            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1 flex items-center gap-2">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                {!post.isPublic && (
                                    <>
                                        <span>•</span>
                                        <Globe className="w-3 h-3 text-orange-400/70" />
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-zinc-500">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>

                <div className="text-zinc-200 text-sm whitespace-pre-wrap leading-relaxed mb-6">
                    {post.content}
                </div>

                {post.imageUrl && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-white/5 bg-black/20">
                        <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto max-h-[500px] object-contain" />
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-2 transition-colors text-xs font-bold uppercase tracking-wider",
                            isLiked ? "text-emerald-500" : "text-zinc-500 hover:text-emerald-400"
                        )}
                    >
                        <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                        <span>{post.likesCount || 0}</span>
                    </button>
                    <button
                        onClick={() => setIsCommenting(!isCommenting)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments?.length || 0}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-wider ml-auto"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Comment Section */}
            {(isCommenting || post.comments?.length > 0) && (
                <div className="bg-black/20 border-t border-white/5 p-6 pt-4">
                    {post.comments?.map((comment) => (
                        <div key={comment.id} className="flex gap-3 mb-4 last:mb-0">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {comment.author.avatar ? (
                                    <img src={comment.author.avatar} alt={comment.author.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{comment.author.firstName[0]}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="bg-zinc-800/50 rounded-2xl p-3 inline-block">
                                    <span className="text-xs font-bold text-white block mb-1">
                                        {comment.author.firstName} {comment.author.lastName}
                                    </span>
                                    <p className="text-sm text-zinc-300">
                                        {comment.content}
                                    </p>
                                </div>
                                <span className="text-[10px] text-zinc-600 block mt-1 ml-2">
                                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                                </span>
                            </div>
                        </div>
                    ))}

                    {isCommenting && (
                        <form onSubmit={handleComment} className="mt-4 flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                                Me
                            </div>
                            <input
                                autoFocus
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!commentContent.trim() || isSubmittingComment}
                                className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold h-9"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
