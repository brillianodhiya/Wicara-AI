import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, apiKey } = body;
    
    if (!service || !["assemblyai", "gemini"].includes(service)) {
      return NextResponse.json(
        { success: false, message: "Invalid service" },
        { status: 400 }
      );
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "API key is required" },
        { status: 400 }
      );
    }
    
    // TODO: Implement encryption and storage of API keys in Supabase
    // This is a placeholder response
    return NextResponse.json({
      success: true,
      data: {
        service,
        status: "active",
        lastUpdated: new Date().toISOString()
      },
      message: `${service} API key saved successfully`
    });
  } catch (error) {
    console.error("Error saving API key:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save API key" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const service = request.nextUrl.searchParams.get("service");
    
    if (!service || !["assemblyai", "gemini"].includes(service)) {
      return NextResponse.json(
        { success: false, message: "Invalid service" },
        { status: 400 }
      );
    }
    
    // TODO: Implement retrieval of API key status from Supabase
    // This is a placeholder response
    return NextResponse.json({
      success: true,
      data: {
        service,
        status: "not_configured",
        lastUpdated: null
      },
      message: `${service} API key status retrieved successfully`
    });
  } catch (error) {
    console.error("Error retrieving API key status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve API key status" },
      { status: 500 }
    );
  }
}
