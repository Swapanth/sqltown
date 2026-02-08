import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const form = formidable();
  const [fields, files] = await form.parse(req);

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });

  const file = files.resume[0];

  await drive.files.create({
    requestBody: {
      name: file.originalFilename,
      parents: [process.env.DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.filepath),
    },
  });

  res.json({ success: true });
}
