import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const creds = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT ?? '{}');
  if (!creds) {
    res.status(400).json({ error: 'Missing Google Service Account credentials' });
    return;
  }
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  if (!sheetId) {
    res.status(400).json({ error: 'Missing Google Sheet ID' });
    return;
  }
  const tabName = process.env.NEXT_PUBLIC_GOOGLE_SHEET_TAB_NAME;
  if (!tabName) {
    res.status(400).json({ error: 'Missing Google Sheet Tab Name' });
    return;
  }

  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[tabName];

  if (!sheet) {
    res.status(404).json({ error: 'Sheet not found' });
    return;
  }

  const rows = await sheet.getRows();
  const headers = sheet.headerValues.slice(1);

  let rowsData = {};
  for (let i = 0; i < rows.length; i++) {
    const rowData = (rows[i] as any)._rawData;

    rowsData = {
      ...rowsData,
      [rowData[0]]: rowData.slice(1).map((x: any) => parseFloat(x)),
    };
  }

  res.status(200).json({
    headers,
    rows: rowsData,
  });
}
