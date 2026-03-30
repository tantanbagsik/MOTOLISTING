import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const sessionMatch = cookieHeader?.match(/user_session=([^;]+)/);
    
    if (!sessionMatch) {
      return NextResponse.json({ user: null });
    }

    const sessionData = JSON.parse(decodeURIComponent(sessionMatch[1]));
    return NextResponse.json({ user: sessionData });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
