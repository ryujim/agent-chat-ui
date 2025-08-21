import { error } from '@sveltejs/kit';
import { LANGGRAPH_API_URL, LANGSMITH_API_KEY } from '$env/static/private';

export const fallback = async ({ request, params }) => {
  if (!LANGGRAPH_API_URL || LANGGRAPH_API_URL === 'remove-me' || LANGGRAPH_API_URL === 'your-langgraph-api-url.com') {
    error(500, 'LANGGRAPH_API_URL is not set');
  }

  if (!LANGSMITH_API_KEY || LANGSMITH_API_KEY === 'remove-me' || LANGSMITH_API_KEY === 'your-langsmith-api-key') {
    error(500, 'LANGSMITH_API_KEY is not set');
  }

  const targetUrl = new URL(LANGGRAPH_API_URL);
  targetUrl.pathname = targetUrl.pathname.replace(/\/$/, '') + '/' + params.path;
  targetUrl.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.set('LangSmith-Api-Key', LANGSMITH_API_KEY);
  headers.set('host', targetUrl.host);


  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body,
    duplex: 'half'
  });

  return response;
};
