interface Entry {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

// Helper function to convert entries to markdown
export function entriesToMarkdown(entries: Entry[], type: string): string {
  if (!entries?.length) return "";
  
  return (
    `## ${type}\n\n` +
    entries
      .map((entry: Entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}

const handleDownloadPDF = async () => {
  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.getElementById("resume-preview");
  if (!element) return;

  html2pdf()
    .from(element)
    .set({
      margin: 0.5,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .save();
};
