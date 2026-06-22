import { serverCmsApi, type BlogPost } from '@/lib/server-api';

export function generateSlug(title: string, url?: string): string {
  if (url && url.includes('-')) {
    return url
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/^-+|-+$/g, '');
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min`;
}

export function truncateTitle(title: string, maxLength: number = 50): string {
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength)}...`;
}

export function addTableCellLabels(html: string): string {
  return html.replace(/<table([\s\S]*?)<\/table>/gi, (tableHtml) => {
    const headerMatch = tableHtml.match(/<thead[\s\S]*?<\/thead>/i);
    if (!headerMatch) return tableHtml;

    const headers = [...headerMatch[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)]
      .map((match) => match[1].replace(/<[^>]*>/g, '').trim())
      .filter(Boolean);

    if (headers.length === 0) return tableHtml;

    let rowIndex = 0;
    return tableHtml.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (rowHtml, rowContent) => {
      if (/<th[\s\S]*?<\/th>/i.test(rowContent)) return rowHtml;

      let cellIndex = 0;
      const nextRow = rowHtml.replace(/<td(?![^>]*\sdata-label=)([^>]*)>/gi, (cellOpen, attributes) => {
        const label = headers[cellIndex] || '';
        cellIndex++;
        return label ? `<td${attributes} data-label="${label.replace(/"/g, '&quot;')}">` : cellOpen;
      });

      rowIndex++;
      return nextRow.replace('<tr', `<tr data-mobile-row="${rowIndex}"`);
    });
  });
}

export async function getBlogPostBySlug(
  slug: string,
  classId: number = 0
): Promise<{ post: BlogPost; originalUrl: string } | null> {
  try {
    const blogResponse = await serverCmsApi.getBlogList(1, 100, classId);

    for (const post of blogResponse.list) {
      const originalUrl = post.url;
      if (generateSlug(post.title, originalUrl) === slug) {
        return { post, originalUrl };
      }
    }

    return null;
  } catch (error) {
    console.error('App Router: Failed to fetch blog post:', error);
    return null;
  }
}
