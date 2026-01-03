"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, ExternalLink, LayoutTemplate, Package, Palette, FileText, Upload, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserSite, saveUserSite, type UserSite, type ServiceOffering } from "@/lib/storage-utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardShell } from "@/components/dashboard-shell";

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export default function WebsiteBuilderPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("settings");

    // Site State
    const [site, setSite] = useState<UserSite>({
        id: "",
        userId: "",
        subdomain: "",
        title: "",
        description: "",
        themeColor: "emerald",
        offerings: [],
        pages: [],
        headerLinks: [],
        categories: [],
        published: false,
        updatedAt: new Date().toISOString()
    });

    // New/Edit Offering State
    const [isAddOfferingOpen, setIsAddOfferingOpen] = useState(false);
    const [editingOfferingId, setEditingOfferingId] = useState<string | null>(null);
    const [newOffering, setNewOffering] = useState<Partial<ServiceOffering>>({
        title: "",
        description: "",
        price: 0,
        category: "service"
    });

    useEffect(() => {
        const loadSite = async () => {
            setIsLoading(true);
            const user = api.getUser();
            if (!user) return;

            const existingSite = getUserSite();
            if (existingSite) {
                setSite(existingSite);
            } else {
                // Initialize default site for user
                setSite(prev => ({
                    ...prev,
                    id: crypto.randomUUID(),
                    userId: user.id || "user_1",
                    title: `${user.companyName || "My Business"}`,
                    subdomain: (user.companyName || "site").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    offerings: [],
                    pages: [],
                    headerLinks: [],
                    images: []
                }));
            }
            setIsLoading(false);
        };

        loadSite();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedSite = {
                ...site,
                updatedAt: new Date().toISOString()
            };
            saveUserSite(updatedSite);
            setSite(updatedSite);
            toast.success("Website settings saved successfully!");
        } catch {
            toast.error("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveOffering = () => {
        if (!newOffering.title || !newOffering.price) return;

        if (editingOfferingId) {
            setSite(prev => ({
                ...prev,
                offerings: prev.offerings.map(o => o.id === editingOfferingId ? {
                    ...o,
                    title: newOffering.title!,
                    description: newOffering.description || "",
                    price: Number(newOffering.price),
                    category: newOffering.category as 'service' | 'product',
                    images: newOffering.images || [],
                    stock: newOffering.stock,
                    duration: newOffering.duration,
                    customCategory: newOffering.customCategory
                } : o)
            }));
            toast.success("Offering updated!");
        } else {
            const offering: ServiceOffering = {
                id: crypto.randomUUID(),
                title: newOffering.title,
                description: newOffering.description || "",
                price: Number(newOffering.price),
                category: newOffering.category as 'service' | 'product',
                images: newOffering.images || [],
                stock: newOffering.stock,
                duration: newOffering.duration,
                customCategory: newOffering.customCategory
            };

            setSite(prev => ({
                ...prev,
                offerings: [...prev.offerings, offering]
            }));
            toast.success("Offering added!");
        }

        setIsAddOfferingOpen(false);
        setEditingOfferingId(null);
        setNewOffering({ title: "", description: "", price: 0, category: "service" }); // Reset
    };

    const handleEditOffering = (offering: ServiceOffering) => {
        setEditingOfferingId(offering.id);
        setNewOffering({
            title: offering.title,
            description: offering.description,
            price: offering.price,
            category: offering.category,
            images: offering.images,
            stock: offering.stock,
            duration: offering.duration,
            customCategory: offering.customCategory
        });
        setIsAddOfferingOpen(true);
    };

    const handleRemoveOffering = (id: string) => {
        setSite(prev => ({
            ...prev,
            offerings: prev.offerings.filter(o => o.id !== id)
        }));
        toast.success("Offering removed.");
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <DashboardShell>
            <div className="space-y-6 max-w-5xl mx-auto pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-heading uppercase">Website Builder</h1>
                        <p className="text-zinc-400 text-sm md:text-base">Design your public profile and showcase your services.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {site.published && (
                            <Button variant="outline" asChild className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                                <Link href={`/s/${site.subdomain}`} target="_blank">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Live Site
                                </Link>
                            </Button>
                        )}
                        <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-xs min-w-[100px]">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-[#0c2a27] border border-white/10 p-1 w-full grid grid-cols-4 h-auto">
                        <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-wider text-[10px] md:text-xs font-bold py-2 md:py-1.5 h-full whitespace-normal">
                            <LayoutTemplate className="w-4 h-4 md:mr-2 mb-1 md:mb-0 hidden md:block" /> Site Settings
                        </TabsTrigger>
                        <TabsTrigger value="offerings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-wider text-[10px] md:text-xs font-bold py-2 md:py-1.5 h-full whitespace-normal">
                            <Package className="w-4 h-4 md:mr-2 mb-1 md:mb-0 hidden md:block" /> Products & Services
                        </TabsTrigger>
                        <TabsTrigger value="design" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-wider text-[10px] md:text-xs font-bold py-2 md:py-1.5 h-full whitespace-normal">
                            <Palette className="w-4 h-4 md:mr-2 mb-1 md:mb-0 hidden md:block" /> Design
                        </TabsTrigger>
                        <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-wider text-[10px] md:text-xs font-bold py-2 md:py-1.5 h-full whitespace-normal">
                            <FileText className="w-4 h-4 md:mr-2 mb-1 md:mb-0 hidden md:block" /> Pages
                        </TabsTrigger>
                    </TabsList>

                    {/* Site Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-[#0a2c28]/40 border-white/5 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-white font-heading text-lg">General Info</CardTitle>
                                    <CardDescription className="text-zinc-500">Basic details about your business site.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Site Title</Label>
                                        <Input
                                            value={site.title}
                                            onChange={(e) => setSite({ ...site, title: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="e.g. Acme Consulting"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Description</Label>
                                        <Textarea
                                            value={site.description}
                                            onChange={(e) => setSite({ ...site, description: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white min-h-[100px]"
                                            placeholder="Briefly describe what you do..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0a2c28]/40 border-white/5 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-white font-heading text-lg">Configuration</CardTitle>
                                    <CardDescription className="text-zinc-500">URL and appearance settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Subdomain (URL)</Label>
                                        <div className="flex items-center">
                                            <span className="bg-white/5 border border-r-0 border-white/10 text-zinc-500 px-3 py-2 text-sm rounded-l-md select-none whitespace-nowrap">
                                                <span className="hidden sm:inline">pumpkin.app</span>/s/
                                            </span>
                                            <Input
                                                value={site.subdomain}
                                                onChange={(e) => setSite({ ...site, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                                className="bg-white/5 border-white/10 text-white rounded-l-none font-mono"
                                                placeholder="my-business"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-500">This will be your public link.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Theme Color</Label>
                                        <Select value={site.themeColor} onValueChange={(val) => setSite({ ...site, themeColor: val })}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                                <SelectItem value="emerald">Emerald (Default)</SelectItem>
                                                <SelectItem value="blue">Ocean Blue</SelectItem>
                                                <SelectItem value="purple">Royal Purple</SelectItem>
                                                <SelectItem value="orange">Sunset Orange</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between">
                                        <Label className="text-white font-bold">Publish Site</Label>
                                        <Button
                                            variant={site.published ? "default" : "secondary"}
                                            onClick={() => {
                                                const updated = { ...site, published: !site.published, updatedAt: new Date().toISOString() };
                                                setSite(updated);
                                                saveUserSite(updated);
                                                toast.success(updated.published ? "Site published!" : "Site unpublished.");
                                            }}
                                            className={cn("w-24", site.published ? "bg-emerald-500 hover:bg-emerald-600" : "bg-zinc-700")}
                                        >
                                            {site.published ? "Live" : "Draft"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Offerings Tab */}
                    <TabsContent value="offerings" className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0a2c28]/40 p-4 rounded-xl border border-white/5 gap-4">
                            <div>
                                <h3 className="text-white font-bold text-lg">Your Offerings</h3>
                                <p className="text-zinc-500 text-sm">Add services or products to display on your site.</p>
                            </div>
                            <Dialog open={isAddOfferingOpen} onOpenChange={(open) => {
                                setIsAddOfferingOpen(open);
                                if (!open) {
                                    setEditingOfferingId(null);
                                    setNewOffering({ title: "", description: "", price: 0, category: "service" });
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={() => {
                                            setEditingOfferingId(null);
                                            setNewOffering({ title: "", description: "", price: 0, category: "service" });
                                        }}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-xs gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#051c1c] border-white/10 text-zinc-100 w-[95%] max-w-2xl rounded-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                                    <DialogHeader className="p-6 border-b border-white/5">
                                        <DialogTitle className="text-white font-heading uppercase tracking-widest">
                                            {editingOfferingId ? 'Edit Offering' : 'Add Offering'}
                                        </DialogTitle>
                                        <DialogDescription className="text-zinc-400">
                                            {editingOfferingId ? 'Update your service or product details.' : 'Add a new service or product to your page.'}
                                        </DialogDescription>
                                    </DialogHeader>

                                    {/* ... scrollable content ... */}
                                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Left Column: Essential Info */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-zinc-300">Title</Label>
                                                    <Input
                                                        value={newOffering.title}
                                                        onChange={(e) => setNewOffering({ ...newOffering, title: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white"
                                                        placeholder="e.g. 1-Hour Consultation"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-300">Price ($)</Label>
                                                        <Input
                                                            type="number"
                                                            value={newOffering.price}
                                                            onChange={(e) => setNewOffering({ ...newOffering, price: Number(e.target.value) })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            placeholder="99.00"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-300">Type</Label>
                                                        <Select
                                                            value={newOffering.category}
                                                            onValueChange={(val) => setNewOffering({ ...newOffering, category: val as 'service' | 'product' })}
                                                        >
                                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                                                <SelectItem value="service">Service</SelectItem>
                                                                <SelectItem value="product">Product</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-zinc-300">Category</Label>
                                                    <Select
                                                        value={newOffering.customCategory}
                                                        onValueChange={(val) => setNewOffering({ ...newOffering, customCategory: val })}
                                                    >
                                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                                            {(site.categories || []).map(cat => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                            {(site.categories || []).length === 0 && (
                                                                <SelectItem value="none">No categories created</SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Conditional Fields based on Category */}
                                                {newOffering.category === 'product' && (
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-300">Stock Quantity</Label>
                                                        <Input
                                                            type="number"
                                                            value={newOffering.stock || ''}
                                                            onChange={(e) => setNewOffering({ ...newOffering, stock: Number(e.target.value) })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            placeholder="e.g. 50"
                                                        />
                                                    </div>
                                                )}
                                                {newOffering.category === 'service' && (
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-300">Duration (minutes)</Label>
                                                        <Input
                                                            type="number"
                                                            value={newOffering.duration || ''}
                                                            onChange={(e) => setNewOffering({ ...newOffering, duration: Number(e.target.value) })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            placeholder="e.g. 60"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Column: Media and Description */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-zinc-300">Media</Label>
                                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 bg-black/20 hover:bg-black/30 transition-all group relative cursor-pointer overflow-hidden min-h-[120px]">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const base64 = await fileToBase64(file);
                                                                    setNewOffering({ ...newOffering, images: [base64] });
                                                                }
                                                            }}
                                                        />
                                                        {newOffering.images?.[0] ? (
                                                            <div className="relative z-0 flex flex-col items-center">
                                                                <img src={newOffering.images[0]} alt="Offering Preview" className="h-16 object-contain mb-2" />
                                                                <p className="text-[10px] text-zinc-500">Click to change</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <Upload className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                                                                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Upload Image</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-zinc-300">Description</Label>
                                                    <Textarea
                                                        value={newOffering.description}
                                                        onChange={(e) => setNewOffering({ ...newOffering, description: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white min-h-[100px] text-sm"
                                                        placeholder="Details about this offering..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter className="p-6 bg-black/20 border-t border-white/5">
                                        <Button onClick={handleSaveOffering} className="bg-primary text-primary-foreground w-full font-bold uppercase tracking-widest text-xs">
                                            {editingOfferingId ? 'Update Offering' : 'Add to Page'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {site.offerings.length > 0 ? (
                                site.offerings.map((offering) => (
                                    <Card key={offering.id} className="bg-[#0a2c28]/20 border-white/5 hover:border-primary/30 transition-colors group relative overflow-hidden">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide z-10",
                                                    offering.category === 'service' ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                                                )}>
                                                    {offering.category}
                                                </div>
                                                <div className="flex gap-1 z-10">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-zinc-500 hover:text-primary transition-colors"
                                                        onClick={() => handleEditOffering(offering)}
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-zinc-500 hover:text-red-400 transition-colors"
                                                        onClick={() => handleRemoveOffering(offering.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {offering.images && offering.images.length > 0 && (
                                                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <img src={offering.images[0]} alt={offering.title} className="w-full h-full object-cover grayscale" />
                                                </div>
                                            )}
                                            <CardTitle className="text-white text-lg mt-2 relative z-10">{offering.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold text-emerald-400 mb-2">${offering.price}</p>
                                            <p className="text-sm text-zinc-400 line-clamp-2">{offering.description}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-xl bg-white/5">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No offerings added yet.</p>
                                    <Button variant="link" onClick={() => setIsAddOfferingOpen(true)} className="text-primary mt-2">Add your first item</Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Design Tab */}
                    <TabsContent value="design" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-[#0a2c28]/40 border-white/5 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-white font-heading text-lg">Branding</CardTitle>
                                    <CardDescription className="text-zinc-500">Upload your logo and assets.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 bg-black/20 hover:bg-black/30 transition-all group relative cursor-pointer overflow-hidden">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const base64 = await fileToBase64(file);
                                                        setSite({ ...site, logo: base64 });
                                                    }
                                                }}
                                            />
                                            {site.logo ? (
                                                <div className="relative z-0 flex flex-col items-center">
                                                    <img src={site.logo} alt="Logo Preview" className="h-20 object-contain mb-4" />
                                                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-zinc-400">
                                                        Change Logo
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                                                        <Upload className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <p className="text-sm font-medium text-zinc-400">Click to upload logo</p>
                                                    <p className="text-xs text-zinc-600 mt-1">PNG, JPG, SVG up to 2MB</p>
                                                </div>
                                            )}
                                        </div>
                                        {site.logo && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSite({ ...site, logo: undefined })}
                                                className="w-full text-zinc-500 hover:text-red-400 text-xs"
                                            >
                                                <Trash2 className="w-3 h-3 mr-2" /> Remove Logo
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0a2c28]/40 border-white/5 backdrop-blur-md">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white font-heading text-lg">Navigation</CardTitle>
                                        <CardDescription className="text-zinc-500">Manage header links.</CardDescription>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSite({
                                            ...site,
                                            headerLinks: [...(site.headerLinks || []), { id: crypto.randomUUID(), label: 'New Link', url: '#', type: 'section' }]
                                        })}
                                        className="border-white/10 text-zinc-300 hover:text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {(site.headerLinks || []).map((link, idx) => (
                                        <div key={link.id} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg group">
                                            <div className="grid gap-2 flex-1">
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={link.label}
                                                        onChange={(e) => {
                                                            const newLinks = [...(site.headerLinks || [])];
                                                            newLinks[idx] = { ...link, label: e.target.value };
                                                            setSite({ ...site, headerLinks: newLinks });
                                                        }}
                                                        className="h-8 bg-black/20 border-white/10 text-white text-xs"
                                                        placeholder="Label"
                                                    />
                                                    <Select
                                                        value={link.type}
                                                        onValueChange={(val) => {
                                                            const newLinks = [...(site.headerLinks || [])];
                                                            newLinks[idx] = { ...link, type: val as 'page' | 'external' | 'section' };
                                                            setSite({ ...site, headerLinks: newLinks });
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-8 w-24 bg-black/20 border-white/10 text-white text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                                            <SelectItem value="section">Section</SelectItem>
                                                            <SelectItem value="page">Page</SelectItem>
                                                            <SelectItem value="external">Link</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Input
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const newLinks = [...(site.headerLinks || [])];
                                                        newLinks[idx] = { ...link, url: e.target.value };
                                                        setSite({ ...site, headerLinks: newLinks });
                                                    }}
                                                    className="h-8 bg-black/20 border-white/10 text-zinc-400 text-xs font-mono"
                                                    placeholder={link.type === 'section' ? '#about' : '/page'}
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newLinks = (site.headerLinks || []).filter(l => l.id !== link.id);
                                                    setSite({ ...site, headerLinks: newLinks });
                                                }}
                                                className="h-8 w-8 text-zinc-500 hover:text-red-400"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    {(site.headerLinks || []).length === 0 && (
                                        <p className="text-center text-xs text-zinc-600 py-4">No navigation links added.</p>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="bg-[#0a2c28]/40 border-white/5 backdrop-blur-md">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white font-heading text-lg">Product Categories</CardTitle>
                                        <CardDescription className="text-zinc-500">Add categories to group your items.</CardDescription>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSite({
                                            ...site,
                                            categories: [...(site.categories || []), 'New Category']
                                        })}
                                        className="border-white/10 text-zinc-300 hover:text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {(site.categories || []).map((cat, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                value={cat}
                                                onChange={(e) => {
                                                    const newCats = [...(site.categories || [])];
                                                    newCats[idx] = e.target.value;
                                                    setSite({ ...site, categories: newCats });
                                                }}
                                                className="bg-black/20 border-white/10 text-white text-sm"
                                                placeholder="Category Name"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newCats = (site.categories || []).filter((_, i) => i !== idx);
                                                    setSite({ ...site, categories: newCats });
                                                }}
                                                className="h-8 w-8 text-zinc-500 hover:text-red-400"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    {(site.categories || []).length === 0 && (
                                        <p className="text-center text-xs text-zinc-600 py-4">No categories added.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Pages Tab */}
                    <TabsContent value="pages" className="space-y-6">
                        <Card className="bg-[#0a2c28]/40 border-white/5 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-white font-heading text-lg">Site Pages</CardTitle>
                                    <CardDescription className="text-zinc-500">Create additional pages for your site.</CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-primary text-primary-foreground font-bold uppercase tracking-wider text-xs"
                                    onClick={() => setSite({
                                        ...site,
                                        pages: [...(site.pages || []), { id: crypto.randomUUID(), title: 'New Page', slug: 'new-page', content: 'Add your content here...' }]
                                    })}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Page
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(site.pages || []).map((page, idx) => (
                                    <div key={page.id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="grid gap-4 flex-1 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-zinc-400 uppercase tracking-wider">Page Title</Label>
                                                    <Input
                                                        value={page.title}
                                                        onChange={(e) => {
                                                            const newPages = [...(site.pages || [])];
                                                            newPages[idx] = { ...page, title: e.target.value };
                                                            setSite({ ...site, pages: newPages });
                                                        }}
                                                        className="bg-black/20 border-white/10 text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-zinc-400 uppercase tracking-wider">Slug</Label>
                                                    <div className="flex items-center">
                                                        <span className="bg-white/5 border border-r-0 border-white/10 text-zinc-500 px-3 py-2 text-sm rounded-l-md">/</span>
                                                        <Input
                                                            value={page.slug}
                                                            onChange={(e) => {
                                                                const newPages = [...(site.pages || [])];
                                                                newPages[idx] = { ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') };
                                                                setSite({ ...site, pages: newPages });
                                                            }}
                                                            className="bg-black/20 border-white/10 text-white rounded-l-none font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newPages = (site.pages || []).filter(p => p.id !== page.id);
                                                    setSite({ ...site, pages: newPages });
                                                }}
                                                className="text-zinc-500 hover:text-red-400 mt-6"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-zinc-400 uppercase tracking-wider">Content</Label>
                                            <Textarea
                                                value={page.content}
                                                onChange={(e) => {
                                                    const newPages = [...(site.pages || [])];
                                                    newPages[idx] = { ...page, content: e.target.value };
                                                    setSite({ ...site, pages: newPages });
                                                }}
                                                className="min-h-[100px] bg-black/20 border-white/10 text-zinc-300 font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(site.pages || []).length === 0 && (
                                    <div className="text-center py-8 text-zinc-500 border border-dashed border-white/10 rounded-xl">
                                        <p>No extra pages yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardShell>
    );
}
