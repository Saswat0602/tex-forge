import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Project, IFile } from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = (session.user as { id: string }).id;

    const projectId = req.nextUrl.searchParams.get("projectId");
    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }

    await dbConnect();
    const project = await Project.findOne({ _id: projectId, userId }).lean();

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const files = project.files as IFile[];
    
    // Find main file
    let mainFile = files.find((f) => f.isMain);
    if (!mainFile) {
      mainFile = files[0];
    }
    
    if (!mainFile || !mainFile.content) {
      return new NextResponse("Project has no content to compile", { status: 400 });
    }

    // A basic bundler: replace \input{filename} or \include{filename} with the actual content
    let bundledContent = mainFile.content;
    const inputRegex = /\\(?:input|include)\{([^}]+)\}/g;
    
    bundledContent = bundledContent.replace(inputRegex, (match, filename) => {
      // Find the file in our project array (with or without .tex extension)
      const includedFile = files.find(
        (f) => f.name === filename || f.name === `${filename}.tex`
      );
      
      if (includedFile && includedFile.content) {
        return `\n% --- Begin ${includedFile.name} ---\n${includedFile.content}\n% --- End ${includedFile.name} ---\n`;
      }
      
      return match; // If not found, leave it as is (compiler will throw an error)
    });

    // We use latexonline.cc for compilation. It accepts a GET request with the text.
    const response = await fetch(
      `https://latexonline.cc/compile?text=${encodeURIComponent(bundledContent)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      // Return the error log if possible
      const errorText = await response.text();
      return new NextResponse(errorText || "Compilation failed", { status: response.status });
    }

    // Stream the PDF back to the client
    const pdfBuffer = await response.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="compiled.pdf"',
      },
    });

  } catch (error) {
    console.error("Compilation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
