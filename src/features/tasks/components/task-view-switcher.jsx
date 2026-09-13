'use client';
import React, { Suspense, lazy, useCallback } from 'react';
import { Loader2, PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBulkUpdateTasks } from '@/features/tasks/api/use-bulk-update-tasks';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCurrent } from '@/features/auth/api/use-current';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { columns } from './columns';
import { DataFilters } from './data-filters';
import { DataSearch } from './data-search';
import { DataTable } from './data-table';

// Lazy load heavy components (Kanban drag-and-drop & Big Calendar)
const DataKanban = lazy(() =>
  import('./data-kanban').then((m) => ({ default: m.DataKanban }))
);
const DataCalendar = lazy(() =>
  import('./data-calendar').then((m) => ({ default: m.DataCalendar }))
);

const TabLoader = () => (
  <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
    <Loader2 className="size-5 animate-spin text-muted-foreground" />
  </div>
);

export const TaskViewSwitcher = ({ projectId, hideProjectFilter }) => {
    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table',
    });
    const [{ status, assigneeId, projectId: filteredProjectId, dueDate, search }] = useTaskFilters();
    const workspaceId = useWorkspaceId();
    const { open } = useCreateTaskModal();
    const { data: currentUser } = useCurrent();
    const { data: membersData } = useGetMembers({ workspaceId });

    const members = membersData?.documents || [];
    const currentMember = members.find(
        (m) => m.userId === currentUser?.$id || m.userId === currentUser?.id || m.user_id === currentUser?.$id
    );
    const isAdmin =
        currentUser?.role === 'ADMIN' ||
        currentMember?.role === 'ADMIN' ||
        currentMember?.role === 'OWNER' ||
        currentMember?.organization_role === 'COMPANY_OWNER' ||
        currentMember?.organization_role === 'COMPANY_ADMIN' ||
        currentUser?.isOwner;

    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
        workspaceId,
        status,
        assigneeId,
        projectId: projectId ?? filteredProjectId,
        dueDate,
        search,
    });
    const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();
    const onKanbanChange = useCallback((tasks) => {
        bulkUpdateTasks({
            json: { tasks },
        });
    }, [bulkUpdateTasks]);
    return (<Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1 rounded-lg border">
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => open()} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4"/>
            New
          </Button>
        </div>
        <DottedSeparator className="my-4"/>

        <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
          <DataFilters hideProjectFilter={hideProjectFilter}/>

          <DataSearch />
        </div>

        <DottedSeparator className="my-4"/>
        {isLoadingTasks ? (<div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader2 className="size-5 animate-spin text-muted-foreground"/>
          </div>) : (<>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []}/>
            </TabsContent>

            <TabsContent value="kanban" className="mt-0">
              <Suspense fallback={<TabLoader />}>
                <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} isAdmin={isAdmin}/>
              </Suspense>
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <Suspense fallback={<TabLoader />}>
                <DataCalendar data={tasks?.documents ?? []}/>
              </Suspense>
            </TabsContent>
          </>)}
      </div>
    </Tabs>);
};

