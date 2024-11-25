import { pinata } from "@/utils/config";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file)
    console.log('uploadData', uploadData)
    const url = await pinata.gateways.convert(uploadData.IpfsHash)
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error, please" },
      { status: 500 }
    );
  }
}
