import type { ExportData } from '../core/types';

// Export to plain text
export async function exportToTxt(data: ExportData): Promise<void> {
  let content = `# ${data.meeting.title}\n`;
  content += `Date: ${new Date(data.meeting.createdAt).toLocaleString('id-ID')}\n`;
  content += `Duration: ${Math.floor(data.meeting.duration / 60)} minutes\n\n`;

  if (data.summary) {
    content += `## Summary\n${data.summary}\n\n`;
  }

  if (data.transcript?.utterances && data.transcript.utterances.length > 0) {
    content += `## Transcript\n\n`;
    for (const u of data.transcript.utterances) {
      content += `[${u.speaker}]: ${u.text}\n`;
    }
  } else if (data.transcript?.text) {
    content += `## Transcript\n\n${data.transcript.text}\n`;
  }

  downloadFile(content, `${data.meeting.title}.txt`, 'text/plain');
}

// Export to Markdown
export async function exportToMarkdown(data: ExportData): Promise<void> {
  let content = `# ${data.meeting.title}\n\n`;
  content += `> **Date:** ${new Date(data.meeting.createdAt).toLocaleString('id-ID')}  \n`;
  content += `> **Duration:** ${Math.floor(data.meeting.duration / 60)} minutes\n\n`;

  if (data.summary) {
    content += `## 📝 Summary\n\n${data.summary}\n\n`;
  }

  if (data.transcript?.utterances && data.transcript.utterances.length > 0) {
    content += `## 💬 Transcript\n\n`;
    for (const u of data.transcript.utterances) {
      content += `**${u.speaker}:** ${u.text}\n\n`;
    }
  } else if (data.transcript?.text) {
    content += `## 💬 Transcript\n\n${data.transcript.text}\n`;
  }

  downloadFile(content, `${data.meeting.title}.md`, 'text/markdown');
}

// Export to JSON
export async function exportToJson(data: ExportData): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, `${data.meeting.title}.json`, 'application/json');
}

// Copy to clipboard
export async function copyToClipboard(data: ExportData): Promise<void> {
  let content = `${data.meeting.title}\n`;
  content += `Date: ${new Date(data.meeting.createdAt).toLocaleString('id-ID')}\n\n`;

  if (data.summary) {
    content += `Summary:\n${data.summary}\n\n`;
  }

  if (data.transcript?.text) {
    content += `Transcript:\n${data.transcript.text}`;
  }

  await navigator.clipboard.writeText(content);
}

// Helper to download file
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
