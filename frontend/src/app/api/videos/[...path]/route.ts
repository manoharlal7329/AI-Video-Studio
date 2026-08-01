import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathParts = resolvedParams.path.join("/");
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const targetUrl = `${backendUrl}/api/videos/${pathParts}`;

  try {
    // We parse the formData from the incoming request and pass it to the backend.
    const formData = await request.formData();
    
    const response = await fetch(targetUrl, {
      method: "POST",
      body: formData
    });

    const data = await response.text();
    try {
      return NextResponse.json(JSON.parse(data), { status: response.status });
    } catch (e) {
      console.error("Backend HTML Error Response:", data);
      return NextResponse.json({
        success: false,
        message: "Backend returned invalid JSON (HTML Error page).",
        backendResponse: data.substring(0, 500)
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Proxy POST Error:", error);
    return NextResponse.json({ success: false, message: "Failed to connect to backend", error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathParts = resolvedParams.path.join("/");
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const targetUrl = `${backendUrl}/api/videos/${pathParts}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();
    try {
      return NextResponse.json(JSON.parse(data), { status: response.status });
    } catch (e) {
      console.error("Backend HTML Error Response:", data);
      return NextResponse.json({
        success: false,
        message: "Backend returned invalid JSON (HTML Error page).",
        backendResponse: data.substring(0, 500)
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Proxy GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to connect to backend", error: error.message }, { status: 500 });
  }
}
