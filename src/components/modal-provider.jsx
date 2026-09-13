'use client';
import React, { Suspense, lazy, useEffect, useState } from 'react';

const CreateProjectModal = lazy(() =>
  import('@/features/projects/components/create-project-modal').then((m) => ({
    default: m.CreateProjectModal,
  }))
);
const CreateTaskModal = lazy(() =>
  import('@/features/tasks/components/create-task-modal').then((m) => ({
    default: m.CreateTaskModal,
  }))
);
const EditTaskModal = lazy(() =>
  import('@/features/tasks/components/edit-task-modal').then((m) => ({
    default: m.EditTaskModal,
  }))
);
const CreateWorkspaceModal = lazy(() =>
  import('@/features/workspaces/components/create-workspace-modal').then((m) => ({
    default: m.CreateWorkspaceModal,
  }))
);

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Suspense fallback={null}>
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <CreateWorkspaceModal />
    </Suspense>
  );
};

