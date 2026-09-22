# ChiefOS

A professional multi-agent operating system with liquid-glass design, permissioned capabilities, and human oversight.

![ChiefOS](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop)

## Overview

ChiefOS combines the power of autonomous AI agents with enterprise-grade security through a permission-based architecture. Every agent operation flows through capability tokens, approval queues, and an immutable action ledger, ensuring you maintain complete control.

## Features

### 🎨 Liquid-Glass UI
- iOS-inspired frosted translucent panels
- Smooth spring animations and page transitions
- Professional dark theme with teal/blue accents
- Fully responsive design

### 🤖 Intelligent Agent Fleet
- **Lead**: Orchestrator for planning and coordination
- **Memory**: Persistent knowledge store
- **Code**: Sandboxed file operations (approval-gated)
- **Guardian**: Security monitor and policy enforcement

### 🔒 Enterprise Security
- Capability tokens with scoped permissions
- Approval queue for sensitive operations (`code:write`, `send:*`)
- Append-only action ledger for complete audit trail
- Global kill switch for instant shutdown

### 🔐 Authentication
- Google OAuth via NextAuth
- Session-based authentication
- Automatic user provisioning

## Architecture

\`\`\`mermaid
graph TB
    subgraph "Public Layer"
        Landing[Landing Page]
        Work[Work Page]
        Process[How We Work]
        Services[Services Page]
        Contact[Contact Form]
    end

    subgraph "Auth Layer"
        Google[Google OAuth]
        NextAuth[NextAuth]
    end

    subgraph "Agent OS Layer"
        Dashboard[Dashboard]
        Chat[Chat Interface]
        Agents[Agent Management]
        Approvals[Approval Queue]
        Ledger[Action Ledger]
        KillSwitch[Kill Switch]
    end

    subgraph "Agent Fleet"
        Lead[Lead Agent]
        Memory[Memory Agent]
        Code[Code Agent]
        Guardian[Guardian Agent]
    end

    subgraph "Data Layer"
        Prisma[Prisma ORM]
        SQLite[(SQLite DB)]
    end

    Landing --> Google
    Google --> NextAuth
    NextAuth --> Dashboard
    Dashboard --> Chat
    Chat --> Lead
    Lead --> Memory
    Lead --> Code
    Lead --> Guardian
    Approvals --> Code
    Guardian --> Ledger
    KillSwitch --> Guardian
    Lead --> Prisma
    Memory --> Prisma
    Code --> Prisma
    Guardian --> Prisma
    Prisma --> SQLite
\`\`\`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Auth**: NextAuth with Google OAuth
- **Database**: Prisma + SQLite (PostgreSQL-ready)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud project with OAuth credentials

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/rupak1811/ChiefOS.git
   cd ChiefOS
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Configure Google OAuth**

   a. Go to [Google Cloud Console](https://console.cloud.google.com/)
   
   b. Create a new project or select existing
   
   c. Enable Google+ API
   
   d. Go to **APIs & Services > Credentials**
   
   e. Click **Create Credentials > OAuth 2.0 Client ID**
   
   f. Configure OAuth consent screen (if not done):
      - User Type: External
      - App name: ChiefOS
      - User support email: your email
      - Developer contact: your email
   
   g. Create OAuth Client ID:
      - Application type: Web application
      - Name: ChiefOS
      - Authorized redirect URIs: 
        - \`http://localhost:3000/api/auth/callback/google\`
        - (Add your production URL when deploying)
   
   h. Copy the **Client ID** and **Client Secret**
   
   i. Update \`.env\`:
      \`\`\`env
      GOOGLE_CLIENT_ID="your-client-id-here"
      GOOGLE_CLIENT_SECRET="your-client-secret-here"
      \`\`\`

5. **Generate a secure NextAuth secret**
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`
   Update \`NEXTAUTH_SECRET\` in \`.env\` with the generated value

6. **Initialize the database**
   \`\`\`bash
   npx prisma migrate dev
   npm run seed
   \`\`\`

7. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Script

This walkthrough demonstrates the complete ChiefOS experience:

### 1. Marketing Site Tour

1. **Landing Page** (`/`)
   - Observe the liquid-glass design with frosted panels
   - Watch the image carousel auto-rotate
   - Scroll to see smooth animations and floating elements

2. **Services** (`/services`)
   - Review the four agent capabilities
   - Note the permission scopes for each agent

3. **How We Work** (`/how-we-work`)
   - Follow the 5-step process timeline
   - Understand the approval workflow

4. **Contact** (`/contact`)
   - Fill out the form (gets saved to SQLite)
   - Check for success message

### 2. Authentication

1. Click **Sign In** in the navigation
2. Sign in with Google OAuth
3. Authorize the application
4. Get redirected to the dashboard

### 3. Agent Dashboard

1. **Dashboard** (`/app`)
   - View agent statistics
   - See active agents count
   - Check recent activity

2. **Agents** (`/app/agents`)
   - Review all four agents (Lead, Memory, Code, Guardian)
   - Note their capabilities and status

### 4. Memory Agent Demo

1. Go to **Chat** (`/app/chat`)
2. Send message: `"Remember that my favorite color is blue"`
3. Lead agent stores this in Memory
4. Check the **Ledger** to see the memory:write action
5. Ask: `"What do you remember?"`
6. See the stored memory retrieved

### 5. Code Agent with Approval

1. In **Chat**, send: `"Create a hello.txt file in the sandbox"`
2. Lead agent creates an approval request
3. Go to **Approvals** (`/app/approvals`)
4. See the pending approval for code:write scope
5. Review the details:
   - Agent: Code
   - Action: Create file: hello.txt
   - Scope: code:write
6. Click **Approve**
7. The approval moves to "Recent History"
8. Check **Ledger** to see the action logged

### 6. Kill Switch

1. Go to **Kill Switch** (`/app/kill-switch`)
2. Click **Disable All Agents**
3. System shows "System Disabled" with red indicator
4. Try to chat or create approvals (should be blocked)
5. Go back to Dashboard - see the kill switch warning banner
6. Return to Kill Switch and click **Enable Agents**
7. Check **Ledger** - both kill switch actions are logged

### 7. Action Ledger Audit

1. Go to **Ledger** (`/app/ledger`)
2. Review all logged operations:
   - Memory writes
   - Approval requests
   - Kill switch toggles
   - Chat interactions
3. Note the timestamp, agent, scope, and metadata for each entry

### 8. Sign Out

1. Click profile icon in sidebar
2. Click **Sign Out**
3. Return to marketing homepage

## Project Structure

\`\`\`
ChiefOS/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx          # Landing page with carousel
│   │   ├── work/             # Portfolio/work page
│   │   ├── how-we-work/      # Process page
│   │   ├── services/         # Services page
│   │   └── contact/          # Contact form
│   ├── (app)/                # Authenticated agent OS
│   │   ├── app/
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── agents/       # Agent management
│   │   │   ├── approvals/    # Approval queue
│   │   │   ├── ledger/       # Action ledger
│   │   │   ├── chat/         # Chat with Lead
│   │   │   └── kill-switch/  # Emergency control
│   │   └── layout.tsx        # Auth-required layout
│   ├── api/
│   │   ├── auth/             # NextAuth routes
│   │   ├── chat/             # Chat API with rule planner
│   │   ├── approvals/        # Approval processing
│   │   ├── kill-switch/      # Kill switch control
│   │   └── contact/          # Contact form submission
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + glass morphism
├── components/               # Reusable components
│   ├── GlassCard.tsx        # Animated glass card
│   ├── Button.tsx           # Animated button
│   ├── Navigation.tsx       # Marketing nav
│   ├── Footer.tsx           # Marketing footer
│   ├── AppSidebar.tsx       # App navigation
│   ├── ImageCarousel.tsx    # Auto-rotating carousel
│   ├── ApprovalActions.tsx  # Approve/reject buttons
│   └── KillSwitchToggle.tsx # Kill switch control
├── lib/
│   ├── prisma.ts            # Prisma client
│   └── auth.ts              # NextAuth config
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Agent seeding
└── types/
    └── next-auth.d.ts       # NextAuth type extensions
\`\`\`

## Database Schema

The application uses Prisma with SQLite (easily swappable to PostgreSQL):

- **User**: Authentication and kill switch state
- **Account/Session**: NextAuth session management
- **Agent**: The four specialist agents
- **CapabilityToken**: Scoped permissions with expiry
- **Approval**: Queue for sensitive operations
- **ActionLedger**: Immutable audit trail
- **Memory**: Key-value store for Memory agent
- **Contact**: Contact form submissions

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/api/auth/[...nextauth]\` | GET/POST | NextAuth authentication |
| \`/api/contact\` | POST | Submit contact form |
| \`/api/chat\` | POST | Chat with Lead agent |
| \`/api/approvals\` | POST | Approve/reject operations |
| \`/api/kill-switch\` | POST | Toggle kill switch |

## Optional: LLM Integration

For advanced Lead agent capabilities, you can add API keys:

\`\`\`env
# Optional: AI Provider Keys
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
\`\`\`

The rule-based planner works without these keys for the demo path.

## Development

\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run database migrations
npx prisma migrate dev

# Seed agents
npm run seed

# Open Prisma Studio (database GUI)
npx prisma studio
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - \`DATABASE_URL\` (use Vercel Postgres or external DB)
   - \`NEXTAUTH_URL\` (your production URL)
   - \`NEXTAUTH_SECRET\` (generate new for production)
   - \`GOOGLE_CLIENT_ID\`
   - \`GOOGLE_CLIENT_SECRET\`
4. Update Google OAuth redirect URIs with production URL
5. Deploy

### Docker

\`\`\`bash
docker build -t chiefos .
docker run -p 3000:3000 --env-file .env chiefos
\`\`\`

## Security Considerations

- **Kill Switch**: Instant shutdown of all agent operations
- **Approval Queue**: Human-in-the-loop for sensitive actions
- **Scope Isolation**: Each agent limited to specific capabilities
- **Token Expiry**: Capability tokens automatically expire
- **Audit Trail**: Immutable ledger of all operations
- **Session Management**: Secure session-based authentication

## Roadmap

- [ ] Slack integration for approval notifications
- [ ] Email integration for send:* scope
- [ ] Advanced LLM-powered planning (GPT-4, Claude)
- [ ] Multi-user teams with role-based access
- [ ] Webhook support for external integrations
- [ ] Advanced code sandbox with Docker isolation
- [ ] Real-time agent status dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/rupak1811/ChiefOS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rupak1811/ChiefOS/discussions)
- **Email**: hello@chiefos.dev

---

Built with ❤️ using Next.js, TypeScript, and Prisma
