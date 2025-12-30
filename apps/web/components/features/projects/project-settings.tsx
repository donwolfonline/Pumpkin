"use client"

import { useState } from 'react';
import { Project, ProjectStatus, ProjectPriority } from '@/lib/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, Trash2, Archive, X, Plus, Tag } from 'lucide-react';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';

interface ProjectSettingsProps {
    project: Project;
    onUpdate: (data: Partial<Project>) => void;
    onDelete: () => void;
}

export function ProjectSettings({ project, onUpdate, onDelete }: ProjectSettingsProps) {
    const { toast } = usePumpkinToast();
    const [localProject, setLocalProject] = useState(project);
    const [hasChanges, setHasChanges] = useState(false);
    const [newTeamMember, setNewTeamMember] = useState('');
    const [newTag, setNewTag] = useState('');

    const handleFieldChange = (field: keyof Project, value: any) => {
        setLocalProject(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        onUpdate(localProject);
        setHasChanges(false);
        toast('Project settings saved successfully!', 'success');
    };

    const handleAddTeamMember = () => {
        if (!newTeamMember.trim()) return;

        const newMember = {
            name: newTeamMember.trim(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newTeamMember.trim())}&background=f97316&color=fff`
        };

        const updatedTeam = [...(localProject.team || []), newMember];
        handleFieldChange('team', updatedTeam);
        setNewTeamMember('');
    };

    const handleRemoveTeamMember = (index: number) => {
        const updatedTeam = localProject.team?.filter((_, i) => i !== index) || [];
        handleFieldChange('team', updatedTeam);
    };

    const handleAddTag = () => {
        if (!newTag.trim()) return;

        const updatedTags = [...(localProject.tags || []), newTag.trim()];
        handleFieldChange('tags', updatedTags);
        setNewTag('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = localProject.tags?.filter(tag => tag !== tagToRemove) || [];
        handleFieldChange('tags', updatedTags);
    };

    const handleArchive = () => {
        onUpdate({ status: 'archived' });
        toast('Project archived successfully', 'success');
    };

    return (
        <div className="space-y-6">
            {/* General Settings */}
            <div className="rounded-xl border border-white/5 bg-white/5 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold">General Settings</h3>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">Manage project details and configuration</p>
                    </div>
                    {hasChanges && (
                        <Button onClick={handleSave} size="sm" className="h-8 sm:h-9">
                            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm">Save</span>
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 sm:gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs sm:text-sm">Project Name</Label>
                        <Input
                            id="name"
                            value={localProject.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
                        <Textarea
                            id="description"
                            value={localProject.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            className="bg-black/20 border-white/10 min-h-[80px] text-sm"
                            placeholder="Project description..."
                        />
                    </div>

                    {/* Client & Client Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-xs sm:text-sm">Client Name</Label>
                            <Input
                                id="client"
                                value={localProject.client}
                                onChange={(e) => handleFieldChange('client', e.target.value)}
                                className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientEmail" className="text-xs sm:text-sm">Client Email (for Portal)</Label>
                            <Input
                                id="clientEmail"
                                type="email"
                                value={localProject.clientEmail || ''}
                                onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
                                className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm"
                                placeholder="client@example.com"
                            />
                        </div>
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-xs sm:text-sm">Status</Label>
                            <Select value={localProject.status} onValueChange={(value) => handleFieldChange('status', value as ProjectStatus)}>
                                <SelectTrigger className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="on_hold">On Hold</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-xs sm:text-sm">Priority</Label>
                            <Select value={localProject.priority} onValueChange={(value) => handleFieldChange('priority', value as ProjectPriority)}>
                                <SelectTrigger className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Due Date & Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dueDate" className="text-xs sm:text-sm">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={localProject.dueDate.split('T')[0]}
                                onChange={(e) => handleFieldChange('dueDate', new Date(e.target.value).toISOString())}
                                className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget" className="text-xs sm:text-sm">Budget ($)</Label>
                            <Input
                                id="budget"
                                type="number"
                                min="0"
                                step="100"
                                value={localProject.budget}
                                onChange={(e) => handleFieldChange('budget', parseFloat(e.target.value) || 0)}
                                className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Management */}
            <div className="rounded-xl border border-white/5 bg-white/5 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold mb-2">Team Members</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mb-4">Manage who has access to this project</p>

                <div className="space-y-4">
                    {/* Current Team */}
                    {localProject.team && localProject.team.length > 0 && (
                        <div className="space-y-2">
                            {localProject.team.map((member, index) => (
                                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-black/20 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm sm:text-base font-medium">{member.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveTeamMember(index)}
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Team Member */}
                    <div className="flex gap-2">
                        <Input
                            value={newTeamMember}
                            onChange={(e) => setNewTeamMember(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTeamMember()}
                            placeholder="Team member name..."
                            className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm"
                        />
                        <Button onClick={handleAddTeamMember} size="sm" className="h-9 sm:h-10 px-3 sm:px-4">
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs sm:text-sm">Add</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Project Tags */}
            <div className="rounded-xl border border-white/5 bg-white/5 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold mb-2">Project Tags</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mb-4">Organize and categorize this project</p>

                <div className="space-y-4">
                    {/* Current Tags */}
                    {localProject.tags && localProject.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {localProject.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="pl-2 sm:pl-3 pr-1 sm:pr-2 py-1 text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="h-4 w-4 p-0 ml-1 sm:ml-2 hover:bg-transparent"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Add Tag */}
                    <div className="flex gap-2">
                        <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="Add tag..."
                            className="bg-black/20 border-white/10 h-9 sm:h-10 text-sm"
                        />
                        <Button onClick={handleAddTag} size="sm" className="h-9 sm:h-10 px-3 sm:px-4">
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs sm:text-sm">Add</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mb-4">Irreversible actions for this project</p>

                <div className="space-y-3">
                    {/* Archive */}
                    {localProject.status !== 'archived' && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 h-9 sm:h-10 text-sm">
                                    <Archive className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                    Archive Project
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Archive this project?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will archive the project and hide it from your active projects. You can restore it later from archived projects.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleArchive} className="bg-yellow-600 hover:bg-yellow-700">
                                        Archive
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {/* Delete */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-start border-red-500/20 text-red-400 hover:bg-red-500/10 h-9 sm:h-10 text-sm">
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                Delete Project
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the project and all associated tasks.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}
