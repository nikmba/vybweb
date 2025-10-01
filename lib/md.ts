import { marked } from "marked";
export function mdToHtml(md: string) {
  return md ? (marked.parse(md) as string) : "";
}
