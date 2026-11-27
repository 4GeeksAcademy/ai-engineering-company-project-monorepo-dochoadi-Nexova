import type { Candidate, KnowledgeBaseArticle } from "../types/models.ts";

export function findCandidateById(candidates: Candidate[], id: string): Candidate | null {
  return candidates.find((candidate) => candidate.id === id) ?? null;
}

export function findCandidateByEmail(candidates: Candidate[], email: string): Candidate | null {
  const target = email.trim().toLowerCase();
  return candidates.find((candidate) => candidate.email.trim().toLowerCase() === target) ?? null;
}

// Assumes `sortedCandidates` is sorted by expectedSalary, ascending.
export function binarySearchCandidateBySalary(sortedCandidates: Candidate[], targetSalary: number): number {
  let low = 0;
  let high = sortedCandidates.length - 1;
  while (low <= high) {
    // Middle of the remaining range, rounded down.
    const mid = Math.floor((low + high) / 2);
    const salary = sortedCandidates[mid]?.expectedSalary;
    if (salary === undefined) return -1;
    if (salary === targetSalary) return mid;
    if (salary < targetSalary) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}

function articleMentions(article: KnowledgeBaseArticle, keyword: string): boolean {
  const texts = [article.title, article.problem, article.solution, ...article.keywords];
  return texts.some((text) => text.toLowerCase().includes(keyword));
}

// Client filter first, so another client's articles are never even compared (decision 10c).
export function searchKnowledgeBase(articles: KnowledgeBaseArticle[], clientId: string, keyword: string): KnowledgeBaseArticle[] {
  const target = keyword.trim().toLowerCase();
  if (target === "") return [];
  return articles.filter((article) => article.clientId === clientId).filter((article) => articleMentions(article, target));
}
