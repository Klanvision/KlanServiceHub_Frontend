import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, companyApi, tasksApi, invitationsApi } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  Building2,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Kanban,
  Zap,
  Users,
  Briefcase,
  Plus,
  Trash2,
  Check,
  FolderGit2,
  Layers,
  ShieldAlert,
  Compass,
  CheckCircle,
  Layout,
  Rocket,
  ShieldCheck,
  ChevronRight,
  Target,
  Clock,
  MapPin,
  Mail,
  User,
  Hash,
} from 'lucide-react';

const WORK_TYPES = [
  { id: 'Software Development', label: 'Software Development', icon: '💻', desc: 'Build software, track bugs, run agile sprints' },
  { id: 'IT Support', label: 'IT Support & Operations', icon: '🛠️', desc: 'Manage service requests, incidents, and SLA tracking' },
  { id: 'Business Operations', label: 'Business Operations', icon: '📈', desc: 'Cross-functional process workflows and compliance' },
  { id: 'Marketing', label: 'Marketing & Design', icon: '🎨', desc: 'Campaigns, creative assets, and deliverables' },
  { id: 'Project Management', label: 'Project Management', icon: '📊', desc: 'Milestones, dependencies, and executive roadmaps' },
];

const STEPS_META = [
  { step: 0, title: 'Mode', desc: 'Choose setup type' },
  { step: 1, title: 'Company', desc: 'Name & dedicated URL' },
  { step: 2, title: 'Profile', desc: 'Industry & localization' },
  { step: 3, title: 'Role', desc: 'Your title & department' },
  { step: 4, title: 'Work', desc: 'Team workflow domain' },
  { step: 5, title: 'Agile', desc: 'Execution framework' },
  { step: 6, title: 'Project', desc: 'First workspace project' },
  { step: 7, title: 'Team', desc: 'Invite colleagues' },
];

export const OnboardingWizard = () => {
  const navigate = useNavigate();

  // Wizard Steps:
  // 0: Decision (Create Company vs Join)
  // 1: Company Name & URL Slug
  // 2: Company Profile (Industry, Size, Country, Timezone)
  // 3: Personal Profile (Job Title, Department)
  // 4: Work Type
  // 5: Methodology (Scrum vs Kanban)
  // 6: First Project Creation
  // 7: Invite Team
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form State
  const [company, setCompany] = useState({
    name: 'Acme Technologies',
    domainSlug: 'acme-technologies',
    industry: 'Software Development',
    companySize: '51-200',
    website: 'https://acme.com',
    country: 'India',
    timezone: 'Asia/Kolkata',
    language: 'en-US',
  });

  const [personalProfile, setPersonalProfile] = useState({
    displayName: 'John Smith',
    jobTitle: 'Engineering Manager',
    department: 'Engineering',
    phone: '',
  });

  const [workType, setWorkType] = useState('Software Development');
  const [methodology, setMethodology] = useState('Scrum');

  const [project, setProject] = useState({
    name: 'E-Commerce Platform',
    key: 'ECOM',
    leadName: 'John Smith',
  });

  const [invites, setInvites] = useState([
    { email: 'alice@company.com', role: 'MEMBER' },
    { email: 'bob@company.com', role: 'MEMBER' },
  ]);
  const [newInviteEmail, setNewInviteEmail] = useState('');

  const [createdWorkspaceId, setCreatedWorkspaceId] = useState(null);

  const calculateProgress = () => {
    return Math.round((step / 7) * 100);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!company.name.trim()) {
        toast.error('Company Name is required');
        return;
      }
      // Create Company in backend
      try {
        setLoading(true);
        const res = await companyApi.createCompany({
          name: company.name.trim(),
          domainSlug: company.domainSlug.trim(),
          industry: company.industry,
          companySize: company.companySize,
          country: company.country,
        });
        if (res?.data?.id) {
          setCreatedWorkspaceId(res.data.id);
        }
        setStep(2);
      } catch (err) {
        toast.error(err.message || 'Failed to initialize company workspace');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 2 && createdWorkspaceId) {
      // Update full company profile
      try {
        setLoading(true);
        await companyApi.updateProfile(createdWorkspaceId, company);
        setStep(3);
      } catch (err) {
        toast.error(err.message || 'Failed to save company profile');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      setStep(5);
      return;
    }

    if (step === 5) {
      setStep(6);
      return;
    }

    if (step === 6 && createdWorkspaceId) {
      if (!project.name.trim()) {
        toast.error('Project Name is required');
        return;
      }
      try {
        setLoading(true);
        const projectRes = await apiFetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify({
            name: project.name.trim(),
            key: project.key.trim() || 'PROJ',
            workspaceId: createdWorkspaceId,
            methodology: methodology,
            leadName: personalProfile.displayName || personalProfile.jobTitle || 'Lead',
          }),
        });

        const newProjectId = projectRes?.data?.id || projectRes?.id;

        // Auto create starter board and tasks
        if (newProjectId) {
          await tasksApi.createTask({
            workspaceId: createdWorkspaceId,
            projectId: newProjectId,
            name: 'Initialize Cloud Architecture & DB Schemas',
            description: 'Setup production D1 instances and KV storage configurations.',
            issueType: 'Story',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            storyPoints: 5,
          });

          await tasksApi.createTask({
            workspaceId: createdWorkspaceId,
            projectId: newProjectId,
            name: 'Real-time Event Stream & Webhook Dispatcher',
            description: 'Implement live event broadcaster for team updates.',
            issueType: 'Task',
            priority: 'MEDIUM',
            status: 'DONE',
            storyPoints: 3,
          });
        }

        setStep(7);
      } catch (err) {
        toast.error(err.message || 'Failed to create project');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 7 && createdWorkspaceId) {
      // Send invitations and complete onboarding
      try {
        setLoading(true);
        for (const inv of invites) {
          if (inv.email.trim()) {
            await invitationsApi.createInvitation(createdWorkspaceId, {
              email: inv.email.trim(),
              organizationRole: inv.role,
            });
          }
        }
        toast.success('🎉 Setup complete! Launching your KlanServiceHub workspace...');
        navigate(`/workspaces/${createdWorkspaceId}`);
      } catch (err) {
        toast.error(err.message || 'Failed to complete setup');
      } finally {
        setLoading(false);
      }
      return;
    }

    setStep(step + 1);
  };

  const handleAddInvite = (e) => {
    e.preventDefault();
    if (!newInviteEmail.trim() || !newInviteEmail.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }
    setInvites([...invites, { email: newInviteEmail.trim(), role: 'MEMBER' }]);
    setNewInviteEmail('');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Dynamic Ambient Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Modern Dot Matrix Grid */}
        <div 
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        
        {/* Ambient Gradient Orbs */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[180px]" />

        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070b14]/40 to-[#070b14]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
        {/* Top Header & Branding */}
        <header className="w-full flex items-center justify-between pb-6 sm:pb-8 border-b border-slate-800/80 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center size-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-lg shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              <span>K</span>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-400 border-2 border-[#070b14] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">KlanServiceHub</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Guided Organization Setup</p>
            </div>
          </div>

          {step > 0 && (
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-2 backdrop-blur-md shadow-inner">
              <div className="flex flex-col items-end">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Step {step} of 7</div>
                <div className="text-xs font-extrabold text-blue-400">{calculateProgress()}% Completed</div>
              </div>
              <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm shadow-blue-400"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Mini Stepper Tabs Indicator (For Steps > 0) */}
        {step > 0 && (
          <div className="w-full hidden md:flex items-center justify-between gap-1 mb-6 px-2">
            {STEPS_META.slice(1).map((s, idx) => {
              const stepNum = idx + 1;
              const isPassed = step > stepNum;
              const isCurrent = step === stepNum;
              return (
                <div
                  key={s.step}
                  className={`flex-1 flex flex-col items-center group transition-all duration-200 ${
                    isCurrent ? 'opacity-100 scale-105' : isPassed ? 'opacity-75' : 'opacity-40'
                  }`}
                >
                  <div className="flex items-center w-full">
                    <div
                      className={`size-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/30'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="size-3 stroke-[3]" /> : stepNum}
                    </div>
                    {idx < 6 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 transition-all ${
                          isPassed ? 'bg-emerald-500/60' : 'bg-slate-800'
                        }`}
                      />
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1.5 truncate max-w-[70px] ${
                    isCurrent ? 'text-blue-400 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Wizard Card with Premium Frosted Glassmorphism */}
        <div className="w-full rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-slate-200 relative overflow-hidden transition-all duration-300">
          
          {/* Subtle Top Glowing Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

          {/* Step 0: Decision Screen */}
          {step === 0 && (
            <div className="space-y-8 text-center py-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-400 shadow-sm">
                <Sparkles className="size-3.5 text-blue-400" />
                <span>Enterprise Workspace Setup</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Welcome to <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">KlanServiceHub</span>
                </h2>
                <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  The unified workspace platform for high-velocity software engineering, IT service management, and cross-functional teams.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 text-left">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="relative group rounded-2xl border-2 border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-transparent p-6 space-y-4 hover:border-blue-400 hover:bg-blue-500/15 transition-all duration-200 shadow-lg shadow-blue-950/40 text-left hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30 group-hover:scale-110 transition-transform">
                      <Building2 className="size-6" />
                    </div>
                    <span className="text-xs font-bold text-blue-400 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                      Recommended
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition flex items-center gap-1.5">
                      Create Organization Workspace
                      <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-400" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Initialize a dedicated domain as <strong className="text-slate-200">Company Owner</strong> with complete administrative governance, member permissions, projects, and billing.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast.info('Please open the invitation link from your email, or contact your organization admin.');
                  }}
                  className="group rounded-2xl border border-slate-700/80 bg-slate-800/40 p-6 space-y-4 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200 text-left hover:scale-[1.01]"
                >
                  <div className="size-12 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    <Users className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition flex items-center gap-1.5">
                      Join Existing Workspace
                      <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Collaborate within your existing organization using an invite link or token generated by your workspace administrator.
                    </p>
                  </div>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>Enterprise Grade Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="size-4 text-amber-400" />
                  <span>Cloudflare Global Edge</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Company Name & Workspace URL */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <Building2 className="size-3.5" />
                  <span>Step 1 of 7: Identity</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">What is your company name?</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  This establishes your organization profile and dedicated multi-tenant cloud URL.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Company Legal / Brand Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="size-4" />
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={company.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        setCompany({ ...company, name, domainSlug: slug });
                      }}
                      placeholder="e.g. Acme Technologies"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/60 text-sm font-semibold text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Dedicated Workspace URL
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800/40 px-3.5 py-2.5 text-xs text-slate-400 font-mono focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                    <Globe className="size-4 text-slate-400 mr-2 shrink-0" />
                    <span className="text-slate-500 mr-1 select-none">https://</span>
                    <input
                      type="text"
                      value={company.domainSlug}
                      onChange={(e) => setCompany({ ...company, domainSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="bg-transparent text-blue-400 font-bold focus:outline-none flex-1 text-sm font-mono"
                    />
                    <span className="text-slate-400 select-none font-semibold">.klanservicehub.io</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">You can configure custom domains (e.g. workspace.yourbrand.com) in settings later.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <Compass className="size-3.5" />
                  <span>Step 2 of 7: Organization Details</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Configure organization settings</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Help us tune localization, compliance standards, and workspace defaults.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Industry Domain</label>
                  <select
                    value={company.industry}
                    onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Software Development">Software & Technology</option>
                    <option value="Financial Services">Financial Services & Fintech</option>
                    <option value="Healthcare">Healthcare & Life Sciences</option>
                    <option value="E-Commerce">E-Commerce & Retail</option>
                    <option value="Education">Education & EdTech</option>
                    <option value="Consulting">Professional Services & Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Size</label>
                  <select
                    value={company.companySize}
                    onChange={(e) => setCompany({ ...company, companySize: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="1-10">1–10 teammates (Startup)</option>
                    <option value="11-50">11–50 teammates (Growth)</option>
                    <option value="51-200">51–200 teammates (Mid-Market)</option>
                    <option value="201-1000">201–1000 teammates</option>
                    <option value="1000+">1000+ teammates (Enterprise Scale)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Primary Country / HQ</label>
                  <div className="relative">
                    <MapPin className="size-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={company.country}
                      onChange={(e) => setCompany({ ...company, country: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Primary Timezone</label>
                  <div className="relative">
                    <select
                      value={company.timezone}
                      onChange={(e) => setCompany({ ...company, timezone: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      <option value="America/New_York">America/New_York (EST -5:00)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST -8:00)</option>
                      <option value="America/Chicago">America/Chicago (CST -6:00)</option>
                      <option value="Europe/London">Europe/London (GMT +0:00)</option>
                      <option value="Europe/Berlin">Europe/Berlin (CET +1:00)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST +9:00)</option>
                      <option value="UTC">UTC Universal</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Owner Profile */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <User className="size-3.5" />
                  <span>Step 3 of 7: Administrator Profile</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your role & department</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Let teammates know your leadership position in the organization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Full Name / Display Name</label>
                  <input
                    type="text"
                    value={personalProfile.displayName}
                    onChange={(e) => setPersonalProfile({ ...personalProfile, displayName: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Job Title</label>
                  <input
                    type="text"
                    value={personalProfile.jobTitle}
                    onChange={(e) => setPersonalProfile({ ...personalProfile, jobTitle: e.target.value })}
                    placeholder="e.g. CTO / VP Engineering / Product Lead"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Department / Business Unit</label>
                  <input
                    type="text"
                    value={personalProfile.department}
                    onChange={(e) => setPersonalProfile({ ...personalProfile, department: e.target.value })}
                    placeholder="e.g. Product Engineering & Infrastructure"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Work Type */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <Layers className="size-3.5" />
                  <span>Step 4 of 7: Team Domain</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">What type of work will you manage?</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Select your primary discipline to preload optimized templates, issue types, and board columns.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {WORK_TYPES.map((wt) => {
                  const isSelected = workType === wt.id;
                  return (
                    <button
                      key={wt.id}
                      type="button"
                      onClick={() => setWorkType(wt.id)}
                      className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/15 text-white ring-2 ring-blue-500/30 shadow-lg shadow-blue-900/30 scale-[1.01]'
                          : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{wt.icon}</span>
                        {isSelected && <CheckCircle2 className="size-5 text-blue-400" />}
                      </div>
                      <h4 className="font-bold text-sm mt-3 text-white">{wt.label}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{wt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Methodology */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <Kanban className="size-3.5" />
                  <span>Step 5 of 7: Agile Framework</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">How does your team execute?</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Choose an agile delivery framework. You can customize views and workflows at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setMethodology('Scrum')}
                  className={`rounded-2xl border p-5 text-left transition-all duration-200 flex flex-col justify-between ${
                    methodology === 'Scrum'
                      ? 'border-blue-500 bg-blue-500/15 text-white ring-2 ring-blue-500/30 shadow-lg shadow-blue-900/30'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30 mb-3">
                      <Zap className="size-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white">Scrum</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Time-boxed sprint cadences, story point estimation, sprint backlog, and velocity charts.
                    </p>
                  </div>
                  {methodology === 'Scrum' && (
                    <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-blue-400">
                      <Check className="size-3.5" /> Selected
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMethodology('Kanban')}
                  className={`rounded-2xl border p-5 text-left transition-all duration-200 flex flex-col justify-between ${
                    methodology === 'Kanban'
                      ? 'border-purple-500 bg-purple-500/15 text-white ring-2 ring-purple-500/30 shadow-lg shadow-purple-900/30'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="size-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/30 mb-3">
                      <Kanban className="size-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white">Kanban</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Continuous flow board with Work-In-Progress (WIP) column limits and cycle time metrics.
                    </p>
                  </div>
                  {methodology === 'Kanban' && (
                    <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-purple-400">
                      <Check className="size-3.5" /> Selected
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMethodology('Task Tracking')}
                  className={`rounded-2xl border p-5 text-left transition-all duration-200 flex flex-col justify-between ${
                    methodology === 'Task Tracking'
                      ? 'border-emerald-500 bg-emerald-500/15 text-white ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-900/30'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30 mb-3">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white">Simple List</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Lightweight task assignments, priority tags, and clean milestone checklists.
                    </p>
                  </div>
                  {methodology === 'Task Tracking' && (
                    <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Check className="size-3.5" /> Selected
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: First Project Creation */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <FolderGit2 className="size-3.5" />
                  <span>Step 6 of 7: Initial Project</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create your initial project</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Every workspace contains projects to organize tasks, epics, sprint boards, and tickets.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={project.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const key = name.split(' ').filter(Boolean).map((w) => w[0]).join('').substring(0, 4).toUpperCase() || 'PROJ';
                      setProject({ ...project, name, key });
                    }}
                    placeholder="e.g. NextGen Core Platform"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm font-semibold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Project Key Prefix (For issue tickets: e.g. {project.key || 'PROJ'}-101)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Hash className="size-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        maxLength={6}
                        value={project.key}
                        onChange={(e) => setProject({ ...project, key: e.target.value.toUpperCase() })}
                        className="w-36 pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm font-mono font-bold text-blue-400 focus:border-blue-500 focus:outline-none uppercase"
                      />
                    </div>
                    <span className="text-xs text-slate-400">Short uppercase identifier (2–6 chars)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-3">
                  <Sparkles className="size-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    We will automatically pre-populate your project board with sample starter tasks and configure your methodology template ({methodology}).
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Invite Team */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <Users className="size-3.5" />
                  <span>Step 7 of 7: Team Collaboration</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Invite your team to join</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Send secure invitations to your team. You can also invite more members anytime from Workspace Settings.
                </p>
              </div>

              <form onSubmit={handleAddInvite} className="flex gap-2 pt-2">
                <div className="relative flex-1">
                  <Mail className="size-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 text-xs font-bold text-white shadow transition"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {invites.map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-800/50 px-4 py-2.5 border border-slate-700/60 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="size-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                        {inv.email[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-200">{inv.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                        {inv.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => setInvites(invites.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-red-400 p-1 transition"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wizard Footer Navigation */}
          {step > 0 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition disabled:opacity-50"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                <span>{loading ? 'Configuring...' : step === 7 ? 'Complete Setup & Launch 🚀' : 'Continue'}</span>
                {!loading && <ArrowRight className="size-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Support & Security Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <span>&copy; {new Date().getFullYear()} KlanServiceHub Enterprise</span>
          <span>&bull;</span>
          <span>All rights reserved</span>
        </footer>
      </div>
    </div>
  );
};
