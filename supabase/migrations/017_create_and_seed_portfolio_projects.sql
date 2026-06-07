-- Create and seed a dedicated table for jasmine-portfolio public projects.

create table if not exists public.portfolio_projects (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  role text not null,
  tech_stack text[] not null default '{}',
  ai_agent_arch text,
  outcomes text[] not null default '{}',
  github_url text,
  demo_url text,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.portfolio_projects enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'portfolio_projects' and policyname = 'anon_select_portfolio_projects'
  ) then
    create policy "anon_select_portfolio_projects" on public.portfolio_projects
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'portfolio_projects' and policyname = 'authenticated_select_portfolio_projects'
  ) then
    create policy "authenticated_select_portfolio_projects" on public.portfolio_projects
      for select using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'portfolio_projects' and policyname = 'authenticated_insert_portfolio_projects'
  ) then
    create policy "authenticated_insert_portfolio_projects" on public.portfolio_projects
      for insert with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'portfolio_projects' and policyname = 'authenticated_update_portfolio_projects'
  ) then
    create policy "authenticated_update_portfolio_projects" on public.portfolio_projects
      for update using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'portfolio_projects' and policyname = 'authenticated_delete_portfolio_projects'
  ) then
    create policy "authenticated_delete_portfolio_projects" on public.portfolio_projects
      for delete using (auth.role() = 'authenticated');
  end if;
end $$;

create index if not exists idx_portfolio_projects_category on public.portfolio_projects(category);
create index if not exists idx_portfolio_projects_sort_order on public.portfolio_projects(sort_order);

delete from public.portfolio_projects;

insert into public.portfolio_projects (
  id, title, category, description, role, tech_stack, ai_agent_arch, outcomes, github_url, demo_url, sort_order
) values
  ('internal-slack-summarizer', 'Looking Glass', 'Internal Tools', 'A competitive intelligence platform that automates market research and product validation across competitor sites, review channels, and community signals.', 'Product Lead, Systems Designer, and Prompt Engineer', array['React', 'Vite', 'Web Search', 'LLM Workflows', 'Lovable Cloud'], 'Two-agent workflow: an aggregation layer runs structured research modules across multiple sources, then a synthesis agent scores market need, marketability, and strategic fit into a decision-ready report.', array['Turned scattered market research into a repeatable product-validation workflow', 'Structured findings into scored reports instead of ad hoc notes and screenshots', 'Created a reusable research system for feature, market, and competitor analysis'], null, null, 0),
  ('internal-doc-qa', 'Onsite Trip Planner', 'Internal Tools', 'An internal planning tool designed to help teams organize onsite logistics, coordinate decisions, and keep trip details centralized in one working surface.', 'Product Manager & Systems Designer', array['React', 'Vite', 'JavaScript', 'Workflow Design'], null, array['Reduced planning friction by centralizing trip context and logistics', 'Made coordination easier across stakeholders working from the same source of truth', 'Created a clearer handoff between planning, approvals, and execution'], null, null, 1),
  ('internal-sprint-reporter', 'Sprint Signal', 'Internal Tools', 'A reporting workflow that transforms Jira activity into concise weekly sprint updates tailored for leadership and cross-functional stakeholders.', 'Product Manager & Workflow Builder', array['React', 'Supabase', 'Claude API', 'Jira API'], 'A structured reporting workflow pulls sprint inputs, normalizes delivery updates, and uses LLM prompting to draft executive-ready summaries with blockers, wins, and next steps.', array['Reduced manual reporting overhead at the end of each sprint', 'Improved consistency in how delivery updates were communicated upward', 'Made stakeholder readouts faster to produce and easier to scan'], null, null, 2),
  ('prod-ai-writing-assistant', 'AI Onboarding Engine', 'Production Builds + Experiments', 'A customer-facing AI workflow that helps users get started faster by generating tailored onboarding guidance, product setup steps, and contextual next actions.', 'Founder & Product Manager', array['Next.js', 'Supabase', 'Claude API', 'Stripe', 'Vercel'], 'A context-aware onboarding assistant adapts guidance based on user inputs, setup stage, and product intent, then returns step-by-step recommendations instead of static checklists.', array['Shortened the path from sign-up to first successful workflow', 'Delivered more personalized onboarding than a static product tour', 'Showed how AI can support activation without overwhelming new users'], null, null, 3),
  ('prod-feedback-analyzer', 'Popmenu AI Assistant', 'Production Builds + Experiments', 'A production tool that ingests customer support tickets and reviews, clusters them by theme, and surfaces prioritized product insights.', 'Product Lead & ML Integrations', array['React', 'FastAPI', 'OpenAI Embeddings', 'Supabase', 'Vercel'], 'Two-agent pipeline: (1) Classifier agent tags each ticket with category and sentiment. (2) Synthesis agent groups clusters and generates a prioritized insight report with recommended actions.', array['Condensed high-volume customer feedback into product-ready insight themes', 'Reduced time-to-insight for support and review analysis', 'Helped teams spot recurring issues and prioritize action faster'], null, null, 4),
  ('prod-onboarding-copilot', 'AI Seat Filler', 'Production Builds + Experiments', 'An AI workflow for salons that detects open appointment slots, identifies the best-fit clients to fill them, and generates personalized SMS campaigns for human approval.', 'Product Manager & AI Workflow Designer', array['AI Ranking Logic', 'SMS Campaign Workflows', 'Booking Data', 'Approval Flows'], 'A gap-detection and campaign workflow monitors cancellations and calendar gaps, ranks eligible clients by booking confidence, generates personalized outreach, and sends in intelligent batches that stop automatically once a slot is filled.', array['Turned empty appointment slots into a proactive revenue-recovery workflow', 'Kept owners and stylists in control with explicit approval before any campaign sends', 'Balanced fill-rate goals with guardrails like throttling, deduplication, and batch auto-cancel'], null, null, 5),
  ('capstone-agent-framework', 'PricePilot', 'Capstone + Learning', 'A capstone build exploring multi-agent orchestration patterns, structured handoffs, and failure recovery across a chained AI workflow.', 'Solo Builder', array['Python', 'LangGraph', 'Claude API', 'FastAPI'], 'LangGraph-based orchestrator managing 4 specialized agents: Research, Drafting, Review, and Formatting. Each agent has defined input/output contracts. Supervisor agent handles routing and retry logic on failure.', array['Deepened hands-on understanding of agent routing and orchestration', 'Created a reusable pattern for multi-step AI workflows', 'Documented architecture choices and tradeoffs for future builds'], null, null, 6),
  ('capstone-rag-evaluation', 'Resy Passport', 'Capstone + Learning', 'A mobile-first restaurant journal that lets users log dining experiences, track visits on a map, and share memorable meals through public passport pages.', 'Product Designer & Builder', array['React', 'Vite', 'Supabase', 'Tailwind CSS', 'Google Places API'], null, array['Designed a polished consumer-facing experience around personal food memories', 'Combined structured visit logging with lightweight sharing and mapping', 'Built a strong foundation for later AI features without depending on them for MVP'], null, null, 7),
  ('capstone-pm-ai-certification', 'RunScene AI', 'Capstone + Learning', 'Completed a structured AI PM certification covering LLM fundamentals, prompt engineering, AI product strategy, and responsible AI practices.', 'Student & Project Lead', array['Claude API', 'OpenAI API', 'Python', 'React'], null, array['Completed 8 hands-on project modules', 'Final capstone project scored in the top 10% of cohort', 'Applied learnings directly to 3 subsequent production builds'], null, null, 8);
