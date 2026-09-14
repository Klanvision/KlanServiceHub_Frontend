import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useCurrent } from '@/features/auth/api/use-current';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { PageLoader } from '@/components/page-loader';
import { ScrollToTop } from '@/components/scroll-to-top';

// Helper for dynamic imports supporting both named and default exports
const lazyLoad = (importFn, exportName) =>
  lazy(async () => {
    const module = await importFn();
    if (exportName && module[exportName]) {
      return { default: module[exportName] };
    }
    if (module.default) {
      return { default: module.default };
    }
    const keys = Object.keys(module);
    if (keys.length > 0) {
      return { default: module[keys[0]] };
    }
    return module;
  });

// Layouts
const AuthLayout = lazyLoad(() => import('@/app/(auth)/layout'));
const DashboardLayout = lazyLoad(() => import('@/app/(dashboard)/layout'));
const StandaloneLayout = lazyLoad(() => import('@/app/(standalone)/layout'));
const NotFoundPage = lazyLoad(() => import('@/app/not-found'));

// Dashboard & Workspace Views
const WorkspaceIdClient = lazyLoad(() => import('@/app/(dashboard)/workspaces/[workspaceId]/client'), 'WorkspaceIdClient');
const ProjectIdClient = lazyLoad(() => import('@/app/(dashboard)/workspaces/[workspaceId]/projects/[projectId]/client'), 'ProjectIdClient');
const TaskIdClient = lazyLoad(() => import('@/app/(dashboard)/workspaces/[workspaceId]/tasks/[taskId]/client'), 'TaskIdClient');
const TaskViewSwitcher = lazyLoad(() => import('@/features/tasks/components/task-view-switcher'), 'TaskViewSwitcher');
const CreateWorkspaceForm = lazyLoad(() => import('@/features/workspaces/components/create-workspace-form'), 'CreateWorkspaceForm');
const WorkspaceIdSettingsClient = lazyLoad(() => import('@/app/(standalone)/workspaces/[workspaceId]/settings/client'), 'WorkspaceIdSettingsClient');
const MembersList = lazyLoad(() => import('@/features/workspaces/components/members-list'), 'MembersList');
const WorkspaceIdJoinClient = lazyLoad(() => import('@/app/(standalone)/workspaces/[workspaceId]/join/[inviteCode]/client'), 'WorkspaceIdJoinClient');
const ProjectIdSettingsClient = lazyLoad(() => import('@/app/(standalone)/workspaces/[workspaceId]/projects/[projectId]/settings/client'), 'ProjectIdSettingsClient');
const WorkspacesManagementView = lazyLoad(() => import('@/features/workspaces/components/workspaces-management-view'), 'WorkspacesManagementView');

// SaaS Landing Page
const LandingPageView = lazyLoad(() => import('@/features/landing/components/landing-page'), 'LandingPageView');
const EmailFirstAuth = lazyLoad(() => import('@/features/auth/components/email-first-auth'), 'EmailFirstAuth');
const InvitationAcceptancePage = lazyLoad(() => import('@/app/(public)/invite/[token]/page'), 'InvitationAcceptancePage');

// Legal & Trust Center Pages
const TermsPage = lazyLoad(() => import('@/features/legal/components/terms-page'), 'TermsPage');
const PrivacyPage = lazyLoad(() => import('@/features/legal/components/privacy-page'), 'PrivacyPage');
const SecurityPage = lazyLoad(() => import('@/features/legal/components/security-page'), 'SecurityPage');
const AcceptableUsePage = lazyLoad(() => import('@/features/legal/components/acceptable-use-page'), 'AcceptableUsePage');

// Product Solutions Deep-Dive Pages
const SolutionDetailPage = lazyLoad(() => import('@/features/solutions/components/solution-detail-page'), 'SolutionDetailPage');

// Enterprise Jira Modules
const CompanyProfileView = lazyLoad(() => import('@/features/company/components/company-profile-view'), 'CompanyProfileView');
const UsersAdminView = lazyLoad(() => import('@/features/company/components/users-admin-view'), 'UsersAdminView');
const GroupsAdminView = lazyLoad(() => import('@/features/company/components/groups-admin-view'), 'GroupsAdminView');
const RolesAdminView = lazyLoad(() => import('@/features/company/components/roles-admin-view'), 'RolesAdminView');
const TeamsAdminView = lazyLoad(() => import('@/features/company/components/teams-admin-view'), 'TeamsAdminView');
const WorkflowsAdminView = lazyLoad(() => import('@/features/company/components/workflows-admin-view'), 'WorkflowsAdminView');
const SprintsView = lazyLoad(() => import('@/features/company/components/sprints-view'), 'SprintsView');
const BoardsView = lazyLoad(() => import('@/features/company/components/boards-view'), 'BoardsView');
const DashboardsView = lazyLoad(() => import('@/features/company/components/dashboards-view'), 'DashboardsView');
const ReportsView = lazyLoad(() => import('@/features/company/components/reports-view'), 'ReportsView');
const AutomationsView = lazyLoad(() => import('@/features/company/components/automations-view'), 'AutomationsView');
const IntegrationsView = lazyLoad(() => import('@/features/company/components/integrations-view'), 'IntegrationsView');
const ApiTokensView = lazyLoad(() => import('@/features/company/components/api-tokens-view'), 'ApiTokensView');
const SecurityView = lazyLoad(() => import('@/features/company/components/security-view'), 'SecurityView');
const AuditLogsView = lazyLoad(() => import('@/features/company/components/audit-logs-view'), 'AuditLogsView');
const BillingView = lazyLoad(() => import('@/features/company/components/billing-view'), 'BillingView');
const DataManagementView = lazyLoad(() => import('@/features/company/components/data-management-view'), 'DataManagementView');
const RoadmapView = lazyLoad(() => import('@/features/company/components/roadmap-view'), 'RoadmapView');
const ReleasesView = lazyLoad(() => import('@/features/company/components/releases-view'), 'ReleasesView');

// Enterprise Cross-Project Coordination Suite
const DependenciesView = lazyLoad(() => import('@/features/enterprise/components/enterprise-views'), 'DependenciesView');
const CapacityView = lazyLoad(() => import('@/features/enterprise/components/enterprise-views'), 'CapacityView');
const GovernanceView = lazyLoad(() => import('@/features/enterprise/components/enterprise-views'), 'GovernanceView');
const ServiceManagementView = lazyLoad(() => import('@/features/enterprise/components/enterprise-views'), 'ServiceManagementView');
const AssetsView = lazyLoad(() => import('@/features/enterprise/components/enterprise-views'), 'AssetsView');
const DeploymentsView = lazyLoad(() => import('@/features/enterprise/components/enterprise-views'), 'DeploymentsView');
const PortfoliosView = lazyLoad(() => import('@/features/enterprise/components/enterprise-views'), 'PortfoliosView');

// Protected Route Component
const ProtectedRoute = () => {
  const { data: user, isLoading } = useCurrent();
  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
};

// Public/Guest Route Component
const PublicRoute = () => {
  const { data: user, isLoading } = useCurrent();
  if (isLoading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
};

// Home Redirect / SaaS Landing Page Component
const HomePage = () => {
  const { data: user, isLoading: isLoadingUser } = useCurrent();
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useGetWorkspaces({
    enabled: !!user,
  });

  if (user) {
    if (isLoadingWorkspaces) return <PageLoader />;
    if (!workspaces || workspaces.total === 0) return <Navigate to="/workspaces/create" replace />;
    const wsId = workspaces.documents[0]?.$id || workspaces.documents[0]?.id;
    if (wsId) return <Navigate to={`/workspaces/${wsId}`} replace />;
    return <Navigate to="/workspaces/create" replace />;
  }

  // Render Landing Page immediately for visitors with zero spinner lag
  return <LandingPageView />;
};

import { ErrorBoundary } from '@/components/error-boundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Landing & Invitation Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/landing" element={<LandingPageView />} />
          <Route path="/invite/:token" element={<InvitationAcceptancePage />} />

          {/* Legal & Trust Center Routes */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/trust" element={<SecurityPage />} />
          <Route path="/acceptable-use" element={<AcceptableUsePage />} />
          <Route path="/aup" element={<AcceptableUsePage />} />

          {/* Product Solutions Lifecycle Pages */}
          <Route path="/solutions" element={<SolutionDetailPage />} />
          <Route path="/solutions/:slug" element={<SolutionDetailPage />} />

          {/* Public Email-First Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route
              element={
                <AuthLayout>
                  <Outlet />
                </AuthLayout>
              }
            >
              <Route path="/sign-in" element={<EmailFirstAuth initialMode="SIGN_IN" />} />
              <Route path="/sign-up" element={<EmailFirstAuth initialMode="SIGN_UP" />} />
              <Route path="/forgot-password" element={<EmailFirstAuth initialMode="FORGOT_PASSWORD" />} />
              <Route path="/reset-password" element={<EmailFirstAuth initialMode="RESET_PASSWORD" />} />
            </Route>
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Navigate to="/workspaces/create" replace />} />

            {/* Standalone Pages */}
            <Route
              element={
                <StandaloneLayout>
                  <Outlet />
                </StandaloneLayout>
              }
            >
              <Route
                path="/workspaces/create"
                element={
                  <div className="w-full lg:max-w-xl">
                    <CreateWorkspaceForm />
                  </div>
                }
              />
              <Route path="/workspaces/:workspaceId/settings" element={<WorkspaceIdSettingsClient />} />
              <Route
                path="/workspaces/:workspaceId/members"
                element={
                  <div className="w-full lg:max-w-xl">
                    <MembersList />
                  </div>
                }
              />
              <Route path="/workspaces/:workspaceId/join/:inviteCode" element={<WorkspaceIdJoinClient />} />
              <Route path="/workspaces/:workspaceId/projects/:projectId/settings" element={<ProjectIdSettingsClient />} />
            </Route>

            {/* Dashboard Pages */}
            <Route
              element={
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              }
            >
              <Route path="/workspaces/:workspaceId" element={<WorkspaceIdClient />} />
              <Route path="/workspaces" element={<WorkspacesManagementView />} />
              <Route path="/workspaces/:workspaceId/workspaces-admin" element={<WorkspacesManagementView />} />
              <Route path="/workspaces/:workspaceId/projects/:projectId" element={<ProjectIdClient />} />
              <Route
                path="/workspaces/:workspaceId/tasks"
                element={
                  <div className="flex h-full flex-col">
                    <TaskViewSwitcher />
                  </div>
                }
              />
              <Route path="/workspaces/:workspaceId/tasks/:taskId" element={<TaskIdClient />} />

              {/* Planning Suite */}
              <Route path="/workspaces/:workspaceId/roadmap" element={<RoadmapView />} />
              <Route path="/workspaces/:workspaceId/sprints" element={<SprintsView />} />
              <Route path="/workspaces/:workspaceId/boards" element={<BoardsView />} />
              <Route path="/workspaces/:workspaceId/releases" element={<ReleasesView />} />

              {/* Insights */}
              <Route path="/workspaces/:workspaceId/dashboards" element={<DashboardsView />} />
              <Route path="/workspaces/:workspaceId/reports" element={<ReportsView />} />

              {/* Enterprise Cross-Project Coordination Suite */}
              <Route path="/workspaces/:workspaceId/dependencies" element={<DependenciesView />} />
              <Route path="/workspaces/:workspaceId/capacity" element={<CapacityView />} />
              <Route path="/workspaces/:workspaceId/governance" element={<GovernanceView />} />
              <Route path="/workspaces/:workspaceId/service-desk" element={<ServiceManagementView />} />
              <Route path="/workspaces/:workspaceId/assets" element={<AssetsView />} />
              <Route path="/workspaces/:workspaceId/deployments" element={<DeploymentsView />} />
              <Route path="/workspaces/:workspaceId/portfolios" element={<PortfoliosView />} />

              {/* Enterprise Company Owner & Admin Suite */}
              <Route path="/workspaces/:workspaceId/company-profile" element={<CompanyProfileView />} />
              <Route path="/workspaces/:workspaceId/users-admin" element={<UsersAdminView />} />
              <Route path="/workspaces/:workspaceId/groups-admin" element={<GroupsAdminView />} />
              <Route path="/workspaces/:workspaceId/roles-admin" element={<RolesAdminView />} />
              <Route path="/workspaces/:workspaceId/teams-admin" element={<TeamsAdminView />} />
              <Route path="/workspaces/:workspaceId/workflows-admin" element={<WorkflowsAdminView />} />
              <Route path="/workspaces/:workspaceId/automations" element={<AutomationsView />} />
              <Route path="/workspaces/:workspaceId/integrations" element={<IntegrationsView />} />
              <Route path="/workspaces/:workspaceId/api-tokens" element={<ApiTokensView />} />
              <Route path="/workspaces/:workspaceId/security" element={<SecurityView />} />
              <Route path="/workspaces/:workspaceId/audit-logs" element={<AuditLogsView />} />
              <Route path="/workspaces/:workspaceId/billing" element={<BillingView />} />
              <Route path="/workspaces/:workspaceId/data-management" element={<DataManagementView />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
