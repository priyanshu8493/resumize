import type { TemplateType } from './store';

interface TemplateDef {
  name: string;
  label: string;
  description: string;
  color: string;
  systemPrompt: string;
}

export const TEMPLATES: Record<TemplateType, TemplateDef> = {
  modern: {
    name: 'modern',
    label: 'Modern',
    description: 'Clean, spacious layout with subtle headers — ideal for tech roles',
    color: '#0071E3',
    systemPrompt: `Use this modern template structure with clean horizontal rules between sections, spacious margins, and subtle section headers in small caps:

\`\`\`latex
\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{margin=0.7in}
\\usepackage{enumitem}
\\setlist{nosep,leftmargin=*}
\\usepackage{hyperref}
\\hypersetup{hidelinks}
\\usepackage{xcolor}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\begin{document}
\\centerline{\\LARGE\\textbf{NAME}}
\\centerline{\\small\\href{mailto:email@example.com}{email@example.com} \\hspace{0.5em} (123) 456-7890 \\hspace{0.5em} \\href{https://github.com/username}{github.com/username} \\hspace{0.5em} \\href{https://linkedin.com/in/username}{linkedin.com/in/username}}
\\vspace{0.25cm}
\\rule{\\linewidth}{0.4pt}
\\vspace{0.2cm}

{\\small\\textbf{Professional Summary}}
\\vspace{0.1cm}
\\normalsize Experienced software engineer with 5+ years building scalable systems...
\\vspace{0.2cm}

{\\small\\textbf{Experience}}
\\vspace{0.1cm}
\\normalsize
\\textbf{Company Name} \\hfill Location \\\\
\\textit{Job Title} \\hfill Start -- End
\\begin{itemize}
  \\item Accomplished [X] as measured by [Y], by doing [Z].
\\end{itemize}
\\vspace{0.2cm}

{\\small\\textbf{Projects}}
\\vspace{0.1cm}
\\normalsize
\\textbf{Project Name} \\hfill Tech Stack
\\begin{itemize}
  \\item Accomplished [X] as measured by [Y], by doing [Z].
\\end{itemize}
\\vspace{0.2cm}

{\\small\\textbf{Skills}}
\\vspace{0.1cm}
\\normalsize
\\textbf{Languages:} Python, TypeScript \\\\
\\textbf{Frameworks:} React, Node.js \\\\
\\textbf{Tools:} Git, Docker
\\vspace{0.2cm}

{\\small\\textbf{Education}}
\\vspace{0.1cm}
\\normalsize
\\textbf{University} \\hfill Location \\\\
\\textit{Degree} \\hfill Graduation Date
\\begin{itemize}
  \\item Relevant coursework: ...
\\end{itemize}
\\end{document}
\`\`\``,
  },

  classic: {
    name: 'classic',
    label: 'Classic',
    description: 'Traditional two-section layout with bold headers — standard for finance/consulting',
    color: '#1D1D1F',
    systemPrompt: `Use this classic template with bold section headers, slightly tighter margins, and traditional layout:

\`\`\`latex
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{margin=0.6in}
\\usepackage{enumitem}
\\setlist{nosep,leftmargin=*}
\\usepackage{hyperref}
\\hypersetup{hidelinks}
\\usepackage{xcolor}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{2pt}
\\begin{document}
\\centerline{\\LARGE\\textbf{NAME}}
\\centerline{\\small\\href{mailto:email@example.com}{email@example.com} \\hspace{0.5em} (123) 456-7890 \\hspace{0.5em} \\href{https://github.com/username}{github.com/username} \\hspace{0.5em} \\href{https://linkedin.com/in/username}{linkedin.com/in/username}}
\\vspace{0.2cm}

\\textbf{Education}
\\vspace{0.1cm}
\\textbf{University} \\hfill Location \\\\
\\textit{Degree} \\hfill Graduation Date
\\begin{itemize}
  \\item GPA: 3.8/4.0 | Dean's List
\\end{itemize}
\\vspace{0.15cm}

\\textbf{Experience}
\\vspace{0.1cm}
\\textbf{Company Name} \\hfill Location \\\\
\\textit{Job Title} \\hfill Start -- End
\\begin{itemize}
  \\item Accomplished [X] as measured by [Y], by doing [Z].
\\end{itemize}
\\vspace{0.15cm}

\\textbf{Projects}
\\vspace{0.1cm}
\\textbf{Project Name} \\hfill Tech Stack
\\begin{itemize}
  \\item Accomplished [X] as measured by [Y], by doing [Z].
\\end{itemize}
\\vspace{0.15cm}

\\textbf{Skills}
\\vspace{0.1cm}
\\textbf{Languages:} Python, TypeScript \\\\
\\textbf{Frameworks:} React, Node.js \\\\
\\textbf{Tools:} Git, Docker \\\\
\\textbf{Interests:} Open source, Distributed systems
\\end{document}
\`\`\``,
  },

  minimal: {
    name: 'minimal',
    label: 'Minimal',
    description: 'Ultra-minimal, dense layout — maximizes content per page for experienced candidates',
    color: '#6E6E73',
    systemPrompt: `Use this minimal, dense template with no decorative elements — just content:

\`\`\`latex
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{margin=0.5in}
\\usepackage{enumitem}
\\setlist{nosep,leftmargin=*}
\\usepackage{hyperref}
\\hypersetup{hidelinks}
\\usepackage{xcolor}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\begin{document}
\\centerline{\\textbf{NAME} \\hfill \\href{mailto:email@example.com}{email@example.com} \\hspace{0.3em} (123) 456-7890 \\hspace{0.3em} \\href{https://github.com/username}{github} \\hspace{0.3em} \\href{https://linkedin.com/in/username}{linkedin}}
\\vspace{0.1cm}

\\textbf{SUMMARY}
\\vspace{0.05cm}
Experienced software engineer with 5+ years building scalable systems...
\\vspace{0.1cm}

\\textbf{EXPERIENCE}
\\vspace{0.05cm}
\\textbf{Company Name} \\hfill Location \\\\
\\textit{Job Title} \\hfill Start -- End
\\begin{itemize}
  \\item Accomplished [X] as measured by [Y], by doing [Z].
\\end{itemize}
\\vspace{0.08cm}

\\textbf{PROJECTS}
\\vspace{0.05cm}
\\textbf{Project Name} \\hfill Tech Stack
\\begin{itemize}
  \\item Accomplished [X] as measured by [Y], by doing [Z].
\\end{itemize}
\\vspace{0.08cm}

\\textbf{SKILLS}
\\vspace{0.05cm}
\\textbf{Languages:} Python, TypeScript | \\textbf{Frameworks:} React, Node.js | \\textbf{Tools:} Git, Docker
\\vspace{0.08cm}

\\textbf{EDUCATION}
\\vspace{0.05cm}
\\textbf{University} \\hfill Location \\\\
\\textit{Degree} \\hfill Graduation Date
\\end{document}
\`\`\``,
  },
};

export function getTemplate(type: TemplateType): TemplateDef {
  return TEMPLATES[type] || TEMPLATES.modern;
}
