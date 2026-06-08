import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const workerPath = path.join(
    process.cwd(),
    "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"
  );
  const content = readFileSync(workerPath);
  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
