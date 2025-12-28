"use client"

import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Bold, Italic, List, AlignLeft, Image as ImageIcon, Save, Eye } from 'lucide-react';

export default function DocumentEditorPage() {
    return (
        <DashboardShell>
            <div className="flex flex-col h-[calc(100vh-8rem)]">
                <PageHeader
                    title="New Proposal"
                    action={{
                        label: 'Save Draft',
                        icon: <Save className="h-4 w-4" />,
                        onClick: () => console.log('Save')
                    }}
                    breadcrumbs={[
                        { label: 'Documents', href: '/documents' },
                        { label: 'Editor' }
                    ]}
                />

                <div className="mb-4">
                    <Input placeholder="Document Title" className="text-lg font-semibold h-12" defaultValue="Untitled Proposal" />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
                    {/* Editor Area */}
                    <Card className="md:col-span-3 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                            <Separator orientation="vertical" className="h-6 mx-1" />
                            <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><AlignLeft className="h-4 w-4" /></Button>
                            <Separator orientation="vertical" className="h-6 mx-1" />
                            <Button variant="ghost" size="icon" className="h-8 w-8"><ImageIcon className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto outline-none focus:ring-0">
                            <div contentEditable className="min-h-full outline-none prose max-w-none">
                                <h1>Project Proposal</h1>
                                <p>Introduction goes here...</p>
                                <h2>Scope of Work</h2>
                                <ul>
                                    <li>Item 1</li>
                                    <li>Item 2</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Sidebar Controls */}
                    <div className="space-y-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3 text-sm">Document Settings</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Client</label>
                                    <Input className="h-8 mt-1" placeholder="Select client..." />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Valid Until</label>
                                    <Input type="date" className="h-8 mt-1" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <h3 className="font-semibold mb-3 text-sm">Blocks</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">Pricing Table</Button>
                                <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">Image Grid</Button>
                                <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">Testimonial</Button>
                                <Button variant="outline" size="sm" className="justify-start h-auto py-2 px-3 text-xs">Signature</Button>
                            </div>
                        </Card>

                        <Button className="w-full" variant="secondary">
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
