# TexForge Folder Structure

```text
texforge/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── editor/
│   │   │   └── [projectId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   │
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── compile/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   └── templates/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   │
│   │   ├── editor/
│   │   │   ├── monaco-editor.tsx
│   │   │   ├── compile-button.tsx
│   │   │   ├── editor-toolbar.tsx
│   │   │   └── editor-layout.tsx
│   │   │
│   │   ├── pdf/
│   │   │   ├── pdf-viewer.tsx
│   │   │   ├── pdf-toolbar.tsx
│   │   │   └── pdf-preview.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── project-card.tsx
│   │   │   ├── recent-projects.tsx
│   │   │   └── stats-card.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── create-project.tsx
│   │   │   ├── delete-project.tsx
│   │   │   └── rename-project.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── auth-provider.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── user-menu.tsx
│   │   │
│   │   └── ui/
│   │       └── shadcn-components
│   │
│   ├── actions/
│   │   │
│   │   ├── project.actions.ts
│   │   ├── compile.actions.ts
│   │   ├── upload.actions.ts
│   │   └── auth.actions.ts
│   │
│   ├── lib/
│   │   │
│   │   ├── mongodb.ts
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   ├── compiler.ts
│   │   ├── validators.ts
│   │   └── utils.ts
│   │
│   ├── models/
│   │   │
│   │   ├── User.ts
│   │   ├── Project.ts
│   │   └── Template.ts
│   │
│   ├── hooks/
│   │   │
│   │   ├── use-project.ts
│   │   ├── use-editor.ts
│   │   ├── use-pdf.ts
│   │   └── use-auth.ts
│   │
│   ├── providers/
│   │   │
│   │   ├── session-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   │
│   ├── types/
│   │   │
│   │   ├── user.types.ts
│   │   ├── project.types.ts
│   │   └── api.types.ts
│   │
│   ├── constants/
│   │   │
│   │   ├── routes.ts
│   │   ├── templates.ts
│   │   └── config.ts
│   │
│   └── middleware.ts
│
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
