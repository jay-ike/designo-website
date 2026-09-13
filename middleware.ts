import {next} from "@vercel/functions";

const csp = (nonce: string) =>  [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`, // adjust if you use inline styles
    `img-src 'self' data: https:`,
    `font-src 'self' data: https:`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
].join("; ");

const compressionKeys = [
    "Content-Encoding",
    "Content-Length",
    "ETag",
    "Content-Digest",
    "Digest"
];

export const config = {
    matcher:  "/((?!_next|assets|favicon.ico).*)",
    runtime: "nodejs"
};

export default async function middleware(request: Request) {
    const url = new URL(request.url);
    const accept = request.headers.get("accept") || "";
    let response: Response;
    let nonce: string;
    let tmp;
    if (!accept.includes("text/html")) {
        return next();
    }
    response = await fetch(url.toString(), {
        headers: { "x-middleware-self-fetch": "true", },
    });
    // If the internal request is detected, let it pass through
    // (this is the raw cached HTML without a nonce)
    if (request.headers.get("x-middleware-self-fetch") === "true") {
        return next();
    }
    tmp = await response.text();
    nonce = crypto.randomUUID().replace(/-/g, "");
    tmp = tmp.replace( /<script(?![^>]*\bnonce=)/g, `<script nonce="${nonce}"`);
    return new Response(tmp, {
        status: response.status,
        headers: Object.assign(Object.fromEntries(Array.from(
            response.headers.entries()
        ).filter((e) => !compressionKeys.includes(e[0]))), {
            "Content-Security-Policy": csp(nonce),
            "Cache-Control": "private, no-store", // nonce must not be cached
            "Vary": "Accept-Encoding", // ensure proper caching of variants
        }),
    });
};
