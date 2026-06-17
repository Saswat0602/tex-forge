export type ProjectTemplate = {
  id: string;
  name: string;
  description: string;
  files: { name: string; content: string; type: "text" | "image" | "pdf"; isMain: boolean }[];
};

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Blank Document",
    description: "A simple empty LaTeX document to start from scratch.",
    files: [
      {
        name: "main.tex",
        content: "\\documentclass{article}\n\\begin{document}\n\nHello World!\n\n\\end{document}",
        type: "text",
        isMain: true,
      },
    ],
  },
  {
    id: "resume",
    name: "Resume / CV",
    description: "A clean, professional resume template.",
    files: [
      {
        name: "main.tex",
        content: "\\documentclass[10pt, letterpaper]{article}\n\\usepackage[margin=1in]{geometry}\n\\begin{document}\n\n\\begin{center}\n{\\huge \\textbf{John Doe}}\\\\[0.5em]\nemail@example.com $\\vert$ (123) 456-7890 $\\vert$ LinkedIn $\\vert$ GitHub\n\\end{center}\n\n\\section*{Education}\n\\textbf{University of Example} \\hfill 2020 -- 2024\\\\\nB.S. in Computer Science \\hfill GPA: 3.9/4.0\n\n\\section*{Experience}\n\\textbf{Software Engineer Intern} \\hfill Summer 2023\\\\\nTech Company, City, State\n\\begin{itemize}\n\\item Developed a new feature for the main application.\n\\item Improved database query performance by 20\\%.\n\\end{itemize}\n\n\\section*{Skills}\n\\textbf{Languages:} Java, Python, C++, JavaScript\n\n\\end{document}",
        type: "text",
        isMain: true,
      },
    ],
  },
  {
    id: "research",
    name: "Research Paper",
    description: "A standard two-column IEEE format for academic papers.",
    files: [
      {
        name: "main.tex",
        content: "\\documentclass[conference]{IEEEtran}\n\\usepackage{cite}\n\\usepackage{amsmath,amssymb,amsfonts}\n\\usepackage{graphicx}\n\n\\begin{document}\n\n\\title{Paper Title}\n\n\\author{\\IEEEauthorblockN{1\\textsuperscript{st} Given Name Surname}\n\\IEEEauthorblockA{\\textit{dept. name of organization (of Aff.)} \\\\\n\\textit{name of organization (of Aff.)}\\\\\nCity, Country \\\\\nemail address}}\n\n\\maketitle\n\n\\begin{abstract}\nThis document is a model and instructions for LaTeX.\n\\end{abstract}\n\n\\section{Introduction}\nThis document is a model and instructions for LaTeX.\n\n\\section{Related Work}\nHere we discuss related work \\cite{ref1}.\n\n\\bibliographystyle{IEEEtran}\n\\bibliography{references}\n\n\\end{document}",
        type: "text",
        isMain: true,
      },
      {
        name: "references.bib",
        content: "@article{ref1,\n  title={A sample article},\n  author={Smith, John},\n  journal={Journal of Examples},\n  year={2024}\n}",
        type: "text",
        isMain: false,
      }
    ],
  },
  {
    id: "assignment",
    name: "Homework / Assignment",
    description: "A clean layout for math homework and university assignments.",
    files: [
      {
        name: "main.tex",
        content: "\\documentclass[12pt]{article}\n\\usepackage[margin=1in]{geometry}\n\\usepackage{amsmath,amssymb}\n\n\\title{MATH 101: Assignment 1}\n\\author{Jane Doe}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section*{Problem 1}\nSolve for $x$: $2x + 5 = 15$.\n\n\\textbf{Solution:}\n\\begin{align*}\n2x + 5 &= 15 \\\\\n2x &= 10 \\\\\nx &= 5\n\\end{align*}\n\n\\end{document}",
        type: "text",
        isMain: true,
      },
    ],
  }
];
