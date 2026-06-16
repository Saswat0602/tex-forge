# TexForge

> A cloud-based LaTeX editor and PDF compiler built with Next.js.

---

# Project Vision

TexForge is a modern web application that allows users to write, manage, compile, preview, and download LaTeX documents directly from the browser.

The goal is to provide an experience similar to Overleaf while maintaining a lightweight architecture and a modern developer experience.

---

# Project Goals

Users should be able to:

* Create LaTeX projects
* Upload existing `.tex` files
* Edit documents in a professional code editor
* Compile LaTeX into PDF
* Preview generated PDFs
* Download PDFs
* Save projects in the cloud
* Access projects from any device
* Manage multiple projects from a dashboard

---

# Tech Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui

---

## Authentication

### NextAuth.js

Providers:

* Google OAuth
* GitHub OAuth

Features:

* Protected Routes
* Session Management
* User Profiles

---

## Database

### MongoDB Atlas

Purpose:

* User Management
* Project Storage
* Template Storage
* Metadata Storage

---

## File Storage

### Cloudinary

Used for:

* Generated PDF Files
* Uploaded Images
* Project Assets
* User Uploaded Files

---

## Editor

### Monaco Editor

Features:

* Syntax Highlighting
* Auto Completion
* Code Folding
* Search & Replace
* Multiple Cursors
* Line Numbers

---

## PDF Viewer

### PDF.js

Features:

* In-browser PDF Preview
* Zoom Controls
* Page Navigation

---

## LaTeX Compiler

### Tectonic

Purpose:

* Compile `.tex` → PDF
* Handle LaTeX Packages
* Produce Compilation Logs
* Return Compilation Errors

---

## Hosting

### Oracle Cloud Always Free

Operating System:

* Ubuntu 24.04 LTS

Services:

* Next.js Application
* Tectonic Compiler
* Nginx Reverse Proxy
* PM2 Process Manager

---

# System Architecture

```text
User
 │
 ▼
Next.js Application
 │
 ├── NextAuth
 ├── MongoDB Atlas
 ├── Cloudinary
 └── Tectonic Compiler
      │
      ▼
   Generated PDF
      │
      ▼
  Cloudinary Storage
```

---

# Core Features

## Authentication

### Login

* Google Login
* GitHub Login

### Session Management

* Secure Authentication
* Protected Dashboard
* User Profile

---

## Dashboard

### User Dashboard

Display:

* Total Projects
* Recent Projects
* Last Modified Projects

Actions:

* Create Project
* Open Project
* Delete Project
* Duplicate Project

---

## Project Management

### Create Project

Options:

* Blank Document
* Resume Template
* Research Paper Template
* Assignment Template
* Thesis Template

### Actions

* Create
* Read
* Update
* Delete
* Duplicate
* Rename

---

## File Upload

Supported Formats:

* .tex
* .bib
* .png
* .jpg
* .jpeg
* .pdf

---

## Editor

### Monaco Editor Features

* Syntax Highlighting
* Auto Save
* Line Numbers
* Find & Replace
* Code Folding
* Error Display

---

## Compilation System

### Compile Workflow

1. User clicks Compile
2. Save latest content
3. Send source to compiler
4. Generate PDF
5. Upload PDF to Cloudinary
6. Save PDF URL
7. Display PDF Preview

---

## Error Handling

Display:

* Error Message
* Warning Message
* Line Number
* Compilation Logs

---

## PDF Preview

### Features

* Live Preview
* Zoom In
* Zoom Out
* Download PDF
* Page Navigation

---

# Database Design

## Users Collection

```ts
{
  _id: string
  name: string
  email: string
  image: string
  role: "user"
  createdAt: Date
}
```

---

## Projects Collection

```ts
{
  _id: string
  userId: string
  title: string
  texContent: string
  pdfUrl: string
  createdAt: Date
  updatedAt: Date
}
```

---

## Templates Collection

```ts
{
  _id: string
  title: string
  category: string
  content: string
}
```

---

# Application Pages

## Public Pages

### Landing Page

Route:

```text
/
```

Contents:

* Hero Section
* Features
* Demo Screenshots
* Login Button

---

### Login

```text
/login
```

---

### Register

```text
/register
```

---

# Protected Pages

### Dashboard

```text
/dashboard
```

---

### Project Editor

```text
/editor/[projectId]
```

---

### Profile

```text
/profile
```

---

### Settings

```text
/settings
```

---

# API Routes

## Authentication

```text
/api/auth/*
```

Managed by NextAuth.

---

## Projects

```text
GET    /api/projects
POST   /api/projects

GET    /api/projects/[id]
PUT    /api/projects/[id]
DELETE /api/projects/[id]
```

---

## Compilation

```text
POST /api/compile
```

Request:

```json
{
  "projectId": "123",
  "texContent": "..."
}
```

Response:

```json
{
  "success": true,
  "pdfUrl": "..."
}
```

---

# Folder Structure

```text
src
│
├── app
│   ├── (auth)
│   ├── dashboard
│   ├── editor
│   ├── profile
│   ├── settings
│   └── api
│
├── components
│   ├── editor
│   ├── dashboard
│   ├── pdf
│   ├── layout
│   └── ui
│
├── lib
│   ├── auth.ts
│   ├── mongodb.ts
│   ├── cloudinary.ts
│   └── compiler.ts
│
├── models
│   ├── User.ts
│   ├── Project.ts
│   └── Template.ts
│
├── hooks
├── types
├── utils
└── constants
```

---

# Environment Variables

```env
MONGODB_URI=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# Development Roadmap

## Phase 1 - Foundation

* Setup Next.js
* Setup TypeScript
* Setup Tailwind
* Setup shadcn/ui
* Setup MongoDB
* Setup NextAuth

Deliverable:

* Authentication working

---

## Phase 2 - Project Management

* Dashboard
* Project CRUD
* Database Integration

Deliverable:

* Users can create and manage projects

---

## Phase 3 - Editor

* Monaco Integration
* Save Functionality
* Auto Save

Deliverable:

* Functional LaTeX Editor

---

## Phase 4 - Compilation Engine

* Install Tectonic
* Build Compile API
* PDF Generation

Deliverable:

* TEX → PDF Conversion

---

## Phase 5 - Preview System

* PDF.js Integration
* Live Preview

Deliverable:

* Real-time PDF Viewing

---

## Phase 6 - Production Deployment

* Oracle Cloud VM
* Nginx Setup
* PM2 Setup
* SSL Certificate

Deliverable:

* Public Production Deployment

---

# Future Enhancements

## AI Features

* Generate LaTeX from Prompt
* AI Resume Builder
* AI Error Fixing
* Research Paper Generator

---

## Collaboration

* Share Projects
* Team Workspaces
* Real-time Editing

---

## Export Options

* PDF
* DOCX
* HTML
* Markdown

---

# Final Deliverable

A production-ready SaaS application that allows users to:

1. Sign In
2. Create Projects
3. Write LaTeX
4. Compile Documents
5. Preview PDFs
6. Download PDFs
7. Store Documents in the Cloud
8. Access Projects Anywhere

Project Name: **TexForge**
Version: **v1.0 MVP**
Target Completion: **4–6 Weeks**
