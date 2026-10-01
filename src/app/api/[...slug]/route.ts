/**
 * Catch-all API route: forwards every /api/* request to the Express app.
 *
 * The adapter bridges the Web Request/Response API that Next.js App Router
 * uses with the Node.js IncomingMessage/ServerResponse that Express expects.
 *
 * Note on 204/205/304: these status codes must have no body (even an empty
 * Buffer is rejected by the Fetch API). The adapter sends null when the
 * collected body is empty or the status is in that list.
 */
import type { NextRequest } from 'next/server';
import { Readable } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import app from '@/server/app';

async function runExpress(request: NextRequest): Promise<Response> {
  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const bodyBuffer = hasBody ? Buffer.from(await request.arrayBuffer()) : Buffer.alloc(0);

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  if (hasBody) headers['content-length'] = String(bodyBuffer.length);

  // Replay the body as a readable stream so Express can parse it
  const nodeReq = new Readable({
    read() {
      this.push(bodyBuffer.length ? bodyBuffer : null);
      this.push(null);
    },
  }) as unknown as IncomingMessage;
  nodeReq.method = request.method;
  nodeReq.url = request.nextUrl.pathname + request.nextUrl.search;
  nodeReq.headers = headers;

  const responseHeaders = new Headers();
  const chunks: Buffer[] = [];
  let statusCode = 200;

  return new Promise<Response>((resolve) => {
    const nodeRes = {
      get statusCode() {
        return statusCode;
      },
      set statusCode(value: number) {
        statusCode = value;
      },
      setHeader(name: string, value: string | number | readonly string[]) {
        responseHeaders.delete(name);
        for (const v of Array.isArray(value) ? value : [String(value)]) {
          responseHeaders.append(name, v);
        }
        return nodeRes;
      },
      getHeader(name: string) {
        return responseHeaders.get(name) ?? undefined;
      },
      removeHeader(name: string) {
        responseHeaders.delete(name);
      },
      write(chunk: unknown) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
        return true;
      },
      end(chunk?: unknown) {
        if (chunk) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
        }
        // 204/205/304 must have no body — Fetch API throws on empty Buffer for these
        const noBody = [204, 205, 304].includes(statusCode) || chunks.length === 0;
        const body = noBody ? null : Buffer.concat(chunks);
        resolve(new Response(body, { status: statusCode, headers: responseHeaders }));
      },
    } as unknown as ServerResponse;

    app(nodeReq, nodeRes);
  });
}

export const GET = runExpress;
export const POST = runExpress;
export const PUT = runExpress;
export const PATCH = runExpress;
export const DELETE = runExpress;
