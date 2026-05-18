Title: Novu Next.js Quickstart Guide | Novu Documentation

Description: Set up Novu in-app notifications in your Next.js app. Install the SDK, add the Inbox component, and trigger your first notification.

Source: https://docs.novu.co/platform/quickstart/nextjs

---

[Skip to content](https://docs.novu.co/platform/quickstart/nextjs#nd-docs-layout)
[Novu Documentation](https://docs.novu.co/)
[Platform](https://docs.novu.co/platform)
[Guides](https://docs.novu.co/guides)
[Framework](https://docs.novu.co/framework)
[Community](https://docs.novu.co/community)
[API Reference](https://docs.novu.co/api-reference)
[Sign In](https://dashboard.novu.co/auth/sign-in)
[Sign Up](https://dashboard.novu.co/auth/sign-up)
[GitHubnovuhq/novu38.9K](https://github.com/novuhq/novu)
GitHubnovuhq/novu
38.9K
Getting Started
[Overview](https://docs.novu.co/platform)
[What is Novu?](https://docs.novu.co/platform/what-is-novu)
[How Novu Works](https://docs.novu.co/platform/how-novu-works)
[React](https://docs.novu.co/platform/quickstart/react)
[Next.js](https://docs.novu.co/platform/quickstart/nextjs)
[Remix](https://docs.novu.co/platform/quickstart/remix)
[Angular](https://docs.novu.co/platform/quickstart/angular)
[Vue](https://docs.novu.co/platform/quickstart/vue)
[Vanilla JS](https://docs.novu.co/platform/quickstart/vanilla-js)
Integrate <Inbox />
[Introduction to Inbox](https://docs.novu.co/platform/inbox)
[Set up the Inbox](https://docs.novu.co/platform/inbox/setup-inbox)
[Headless Mode](https://docs.novu.co/platform/inbox/headless-mode)
[Prepare for Production](https://docs.novu.co/platform/inbox/prepare-for-production)
[Migrate to the New Inbox](https://docs.novu.co/platform/inbox/migration-guide)
Integrate <Subscription />
[Introduction](https://docs.novu.co/platform/subscription)
[Setup the <Subscription />](https://docs.novu.co/platform/subscription/quickstart)
[Customize and configure](https://docs.novu.co/platform/subscription/customize-and-configure)
[Headless hooks](https://docs.novu.co/platform/subscription/headless-hooks)
Build a Workflow
[Overview](https://docs.novu.co/platform/workflow)
[Create a Workflow](https://docs.novu.co/platform/workflow/create-a-workflow)
[Configure Workflow](https://docs.novu.co/platform/workflow/configure-workflow)
[Add and Configure Steps](https://docs.novu.co/platform/workflow/add-and-configure-steps)
[Trigger Workflow](https://docs.novu.co/platform/workflow/trigger-workflow)
[Monitor and Debug Workflow](https://docs.novu.co/platform/workflow/monitor-and-debug-workflow)
[Translations](https://docs.novu.co/platform/workflow/advanced-features/translations)
[Contexts](https://docs.novu.co/platform/workflow/advanced-features/contexts)
Integrate Channels Providers
[Overview](https://docs.novu.co/platform/integrations)
[Demo Integrations](https://docs.novu.co/platform/integrations/demo-integration)
[Chat](https://docs.novu.co/platform/integrations/chat)
[E-mail](https://docs.novu.co/platform/integrations/email)
[Push](https://docs.novu.co/platform/integrations/push)
[SMS](https://docs.novu.co/platform/integrations/sms)
[Trigger Overrides](https://docs.novu.co/platform/integrations/trigger-overrides)
SDKs
[Overview](https://docs.novu.co/platform/sdks)
[@novu/js](https://docs.novu.co/platform/sdks/javascript)
[@novu/react-native](https://docs.novu.co/platform/sdks/react-native)
[Server-Side](https://docs.novu.co/platform/sdks/server)
Developer
[API keys](https://docs.novu.co/platform/developer/api-keys)
[Environments](https://docs.novu.co/platform/developer/environments)
[Environment Variables](https://docs.novu.co/platform/developer/environment-variables)
[Limits](https://docs.novu.co/platform/developer/limits)
[Webhooks](https://docs.novu.co/platform/developer/webhooks)
Account
[Authentication](https://docs.novu.co/platform/account/authentication)
[Roles and permissions](https://docs.novu.co/platform/account/roles-and-permissions)
[Team members](https://docs.novu.co/platform/account/manage-members)
[Billing](https://docs.novu.co/platform/account/billing)
[SAML SSO & SCIM](https://docs.novu.co/platform/account/sso)
Build with AI
[MCP Server](https://docs.novu.co/platform/build-with-ai/mcp)
[Agent Skills](https://docs.novu.co/platform/build-with-ai/skills)
[Agent Toolkit](https://docs.novu.co/platform/build-with-ai/agent-toolkit)
Additional Resources
[Glossary](https://docs.novu.co/platform/additional-resources/glossary)
[Common errors](https://docs.novu.co/platform/additional-resources/errors)
[Security and Compliance](https://docs.novu.co/platform/additional-resources/security)
[v0.x Documentation](https://docs.novu.co/platform/additional-resources/legacy-documentation)
[Novu Documentation](https://docs.novu.co/)
[Platform](https://docs.novu.co/platform)

[Guides](https://docs.novu.co/guides)
[Framework](https://docs.novu.co/framework)
[Community](https://docs.novu.co/community)
[API Reference](https://docs.novu.co/api-reference)
[Sign In](https://dashboard.novu.co/auth/sign-in)
[Sign Up](https://dashboard.novu.co/auth/sign-up)
[GitHubnovuhq/novu38.9K](https://github.com/novuhq/novu)
GitHubnovuhq/novu
38.9K

Set up Novu in-app notifications in your Next.js app. Install the SDK, add the Inbox component, and trigger your first notification.
Learn how to integrate Novu’s Inbox for real-time in-app notifications in your Next.js application. By the end of this guide, you’ll have a working notification inbox that displays messages triggered from the Novu dashboard.

### [Create a Novu account](https://docs.novu.co/platform/quickstart/nextjs#create-a-novu-account)
[Create a Novu account](https://docs.novu.co/platform/quickstart/nextjs#create-a-novu-account)
[Create a Novu account](https://dashboard.novu.co/auth/sign-up) or [sign in](https://dashboard.novu.co/auth/sign-in) to access the Novu dashboard.

### [Create a new Next.js application](https://docs.novu.co/platform/quickstart/nextjs#create-a-new-nextjs-application)
[Create a new Next.js application](https://docs.novu.co/platform/quickstart/nextjs#create-a-new-nextjs-application)
Run the following command to [create a new Next.js application](https://nextjs.org/docs/app/getting-started/installation):

```
npm create next-app@latest
```


```
npm create next-app@latest
```

### [Install @novu/nextjs](https://docs.novu.co/platform/quickstart/nextjs#install-novunextjs)
[Install @novu/nextjs](https://docs.novu.co/platform/quickstart/nextjs#install-novunextjs)

```
@novu/nextjs
```

Run the following command to install the Next.js Novu SDK:

```
npm install @novu/nextjs
```


```
npm install @novu/nextjs
```

### [Add the notification Inbox to your app](https://docs.novu.co/platform/quickstart/nextjs#add-the-notification-inbox-to-your-app)
[Add the notification Inbox to your app](https://docs.novu.co/platform/quickstart/nextjs#add-the-notification-inbox-to-your-app)
Import Novu’s built-in [<Inbox />](https://docs.novu.co/platform/inbox) component into your layout file and place it in the navbar:

```
import { Inbox } from '@novu/nextjs'; import './globals.css'; export const metadata = { title: 'Novu Next.js Quickstart', description: 'Generated by create next app', }; export default function RootLayout({ children }) { return ( <html lang="en"> <body> <nav className="flex justify-end items-center p-4 gap-4 h-16"> <Inbox applicationIdentifier="YOUR_APPLICATION_IDENTIFIER" subscriber="YOUR_SUBSCRIBER_ID" /> </nav> {children} </body> </html> ); }
```


```
import { Inbox } from '@novu/nextjs'; import './globals.css'; export const metadata = { title: 'Novu Next.js Quickstart', description: 'Generated by create next app', }; export default function RootLayout({ children }) { return ( <html lang="en"> <body> <nav className="flex justify-end items-center p-4 gap-4 h-16"> <Inbox applicationIdentifier="YOUR_APPLICATION_IDENTIFIER" subscriber="YOUR_SUBSCRIBER_ID" /> </nav> {children} </body> </html> ); }
```

If you are signed in to your Novu account, then the applicationIdentifier and subscriberId will be automatically populated. Otherwise, retrieve them from:
- applicationIdentifier: On the Novu dashboard, click API Keys, and copy your unique Application Identifier.
- subscriberId: This represents a user in your system, usually the user ID from your database. For testing, you can use the auto-generated subscriberId from your Novu dashboard. You can locate it under the Subscribers tab on the Novu dashboard.

```
applicationIdentifier
```


```
subscriberId
```

Note: If you pass a subscriberId that does not exist yet, Novu will automatically create a new subscriber with that ID.

```
subscriberId
```

### [Run your application](https://docs.novu.co/platform/quickstart/nextjs#run-your-application)
[Run your application](https://docs.novu.co/platform/quickstart/nextjs#run-your-application)
Start your development server:

```
npm run dev
```


```
npm run dev
```

Once your application is running, you would see a bell icon in the navbar. Click on it, to open the notification Inbox UI.
There are no notifications yet, so let’s trigger one!

### [Trigger your first notification](https://docs.novu.co/platform/quickstart/nextjs#trigger-your-first-notification)
[Trigger your first notification](https://docs.novu.co/platform/quickstart/nextjs#trigger-your-first-notification)
In this step, you'll create a simple workflow to send your first notification via the Inbox component. Follow these steps to set up and trigger a workflow from your Novu dashboard.
1. Go to your [Novu dashboard](https://dashboard.novu.co/auth/sign-in).
2. Click Workflows.
3. Click Create Workflow and then enter a name (e.g., "Welcome Notification").
4. Click Create Workflow to save it.
5. Click the Add Step icon in the workflow editor and then select In-App as the step type.
6. In the In-App template editor, enter:

Subject: "Welcome to Novu"
Body: "Hello, world!"


7. Subject: "Welcome to Novu"
8. Body: "Hello, world!"
9. Once you’ve added the subject and body, close the editor.
10. Click Trigger.
11. Click Test Workflow.
[Novu dashboard](https://dashboard.novu.co/auth/sign-in)
- Subject: "Welcome to Novu"
- Body: "Hello, world!"

### [View the notification in your app](https://docs.novu.co/platform/quickstart/nextjs#view-the-notification-in-your-app)
[View the notification in your app](https://docs.novu.co/platform/quickstart/nextjs#view-the-notification-in-your-app)
Go back to your Next.js app, then click the bell icon.
You should see the notification you just sent from Novu! 🎉

[Next steps](https://docs.novu.co/platform/quickstart/nextjs#next-steps)
[StylingCustomize the look and feel of your Inbox to match your application's design.](https://docs.novu.co/inbox/react/styling)

### Styling
Customize the look and feel of your Inbox to match your application's design.
[Inbox and preferences UI componentsExplore our full-stack UI components libraries for building in-app notifications.](https://docs.novu.co/platform/inbox)

### Inbox and preferences UI components
Explore our full-stack UI components libraries for building in-app notifications.
[Build WorkflowDesign and manage advanced notification workflows.](https://docs.novu.co/platform/workflow)

### Build Workflow
Design and manage advanced notification workflows.
[Multi TenancyManage multiple tenants within an organization.](https://docs.novu.co/platform/concepts/tenants)

### Multi Tenancy
Manage multiple tenants within an organization.
[ReactLearn how to integrate the Novu Inbox component into a React application and add routing with React Router.](https://docs.novu.co/platform/quickstart/react)
React
Learn how to integrate the Novu Inbox component into a React application and add routing with React Router.
[RemixIntegrate Novu in-app notifications into your Remix application. Follow step-by-step setup from install to first notification.](https://docs.novu.co/platform/quickstart/remix)
Remix
Integrate Novu in-app notifications into your Remix application. Follow step-by-step setup from install to first notification.

### On this page
[Create a Novu account](https://docs.novu.co/platform/quickstart/nextjs#create-a-novu-account)
[Create a new Next.js application](https://docs.novu.co/platform/quickstart/nextjs#create-a-new-nextjs-application)
[Install @novu/nextjs](https://docs.novu.co/platform/quickstart/nextjs#install-novunextjs)

```
@novu/nextjs
```

[Add the notification Inbox to your app](https://docs.novu.co/platform/quickstart/nextjs#add-the-notification-inbox-to-your-app)
[Run your application](https://docs.novu.co/platform/quickstart/nextjs#run-your-application)
[Trigger your first notification](https://docs.novu.co/platform/quickstart/nextjs#trigger-your-first-notification)
[View the notification in your app](https://docs.novu.co/platform/quickstart/nextjs#view-the-notification-in-your-app)
[Next steps](https://docs.novu.co/platform/quickstart/nextjs#next-steps)
[Edit this page on GitHub](https://github.com/novuhq/docs/edit/main/content/docs/platform/quickstart/nextjs.mdx)
[Novu Documentation](https://docs.novu.co/)
[Novu Documentation](https://docs.novu.co/)
- Need help? [Contact Support](https://docs.novu.co/cdn-cgi/l/email-protection#3d4e484d4d524f497d53524b48135e52)
- Check out our [Changelog](https://go.novu.co/changelog?utm_source=docs_footer)
- See what’s coming on our [Roadmap](https://roadmap.novu.co/roadmap)
- Questions? [Contact Sales](https://novu.co/contact-us/)
- LLM? [Read llms.txt](https://docs.novu.co/llms.txt)
[Contact Support](https://docs.novu.co/cdn-cgi/l/email-protection#3d4e484d4d524f497d53524b48135e52)
[Changelog](https://go.novu.co/changelog?utm_source=docs_footer)
[Roadmap](https://roadmap.novu.co/roadmap)
[Contact Sales](https://novu.co/contact-us/)
[Read llms.txt](https://docs.novu.co/llms.txt)
- [Twitter](https://x.com/novuhq)
- [GitHub](https://github.com/novuhq/novu)
- [Discord](https://discord.gg/novu)
[Twitter](https://x.com/novuhq)
[GitHub](https://github.com/novuhq/novu)
[Discord](https://discord.gg/novu)

