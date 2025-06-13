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


