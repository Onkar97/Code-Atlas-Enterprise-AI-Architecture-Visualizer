export interface DiagramRequest {
  repo_path: string;
  query: string;
}

export interface DiagramResponse {
  mermaid_code: string;
  nodes_analyzed: number;
  error?: string;
}