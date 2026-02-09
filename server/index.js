import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure AWS S3 Client
const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Disable automatic checksums to avoid CORS issues
  requestChecksumCalculation: "WHEN_REQUIRED",
});

// Endpoint to generate presigned URL for S3 upload
app.post("/api/upload-url", async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType are required" });
    }

    const key = `resumes/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: "sqltown-bucket1",
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300, // 5 minutes
      unhoistableHeaders: new Set(["x-amz-checksum-crc32"]),
    });

    res.json({
      uploadUrl,
      fileUrl: `https://sqltown-bucket1.s3.ap-southeast-2.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
