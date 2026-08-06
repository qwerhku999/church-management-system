export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    service: "ministryflow-frontend",
    timestamp: new Date().toISOString(),
  });
}
