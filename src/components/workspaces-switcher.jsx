'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { open } = useCreateWorkspaceModal();
  const { data: workspaces } = useGetWorkspaces();

  const documents = workspaces?.documents || [];
  const currentWorkspace = documents.find((w) => (w.$id || w.id) === workspaceId) || documents[0];
  const activeValue = currentWorkspace?.$id || currentWorkspace?.id || workspaceId || '';

  const onSelect = (id) => {
    if (id) {
      router.push(`/workspaces/${id}`);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 select-none">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Workspaces</p>
        <button
          type="button"
          onClick={open}
          title="Create New Workspace"
          className="text-neutral-500 transition hover:text-blue-600 hover:scale-110"
        >
          <RiAddCircleFill className="size-5 cursor-pointer" />
        </button>
      </div>

      <Select onValueChange={onSelect} value={activeValue}>
        <SelectTrigger className="w-full bg-white border border-neutral-200 hover:border-neutral-300 shadow-2xs px-2.5 py-2 font-medium rounded-lg h-auto flex items-center justify-between text-left transition">
          {currentWorkspace ? (
            <div className="flex items-center gap-2.5 truncate max-w-[190px]">
              <WorkspaceAvatar
                name={currentWorkspace.name}
                image={currentWorkspace.imageUrl}
                className="size-7 rounded-md text-xs shrink-0 font-bold"
              />
              <div className="truncate flex flex-col min-w-0">
                <span className="truncate text-xs font-semibold text-neutral-900 leading-tight">
                  {currentWorkspace.name || 'My Workspace'}
                </span>
                <span className="text-[10px] text-neutral-400 capitalize truncate">
                  {currentWorkspace.userRole || 'Active'}
                </span>
              </div>
            </div>
          ) : (
            <SelectValue placeholder="Select workspace" />
          )}
        </SelectTrigger>

        <SelectContent className="w-[230px] p-1 shadow-lg border border-neutral-200 bg-white">
          {documents.map((workspace) => {
            const wsId = workspace.$id || workspace.id;
            return (
              <SelectItem key={wsId} value={wsId} className="cursor-pointer py-1.5 px-2 rounded-md">
                <div className="flex items-center justify-start gap-2.5 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                    className="size-6 rounded-md text-[10px] shrink-0 font-bold"
                  />
                  <div className="flex flex-col truncate">
                    <span className="truncate text-xs font-medium text-neutral-800">{workspace.name}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={() => router.push(workspaceId ? `/workspaces/${workspaceId}/workspaces-admin` : '/workspaces')}
        className="flex items-center justify-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-blue-600 transition py-0.5"
      >
        <span>Manage all workspaces</span>
      </button>
    </div>
  );
};
