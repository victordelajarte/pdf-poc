import { PDFDocument, PDFFont, StandardFonts } from "@cantoo/pdf-lib";
import fs from "fs";

// /**
//  * Récupère un buffer prêt à être chargé par pdf-lib directement depuis une URL
//  */
// const fetchPdfFromURL = async (url) => {
//   const response = await fetch(url);
//   if (!response.ok) throw new Error("Network response was not ok");
//   const arrayBuffer = await response.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   return buffer;
// };

const formPdfBytes = fs.readFileSync("./input.pdf"); // ou fetchPdfFromURL

const pdfDoc = await PDFDocument.load(formPdfBytes);

const signatureFont = StandardFonts.TimesRomanItalic;

const config: PDFGeneratorConfig<TimesheetPDFConfigKeys> = {
  contact_full_name: { text: "Chuck Norris" },
  contact_email: { text: "contact@email.com" },
  contact_phone_number: { text: "+33601020304" },
  talent_full_name: { text: "Arya Stark" },
  talent_qualification: { text: "Technicien spécialisé en rien" },
  talent_email: { text: "arya.stark@winterfell.com" },
  talent_phone_number: { text: "+33610203040" },
  company_name: { text: "Company name - Agency name" },
  contact_signature: { font: signatureFont, text: "Chuck Norris" },
  talent_signature: { font: signatureFont, text: "Arya Stark" },
  total_day_hours: { text: "32h 30min" },
  total_night_hours: { text: "5h 15min" },
  monday_date: { text: "01/01" },
  tuesday_date: { text: "02/01" },
  wednesday_date: { text: "03/01" },
  thursday_date: { text: "04/01" },
  friday_date: { text: "05/01" },
  saturday_date: { text: "06/01" },
  sunday_date: { text: "07/01" },
  month: { text: "janvier" },
  week: { text: "1" },
  start_date: { text: "01/01" },
  end_date: { text: "07/01" },
  monday_day_hours: { text: "8h 00min" },
  monday_night_hours: { text: "-" },
  tuesday_day_hours: { text: "7h 00min" },
  tuesday_night_hours: { text: "0h 30min" },
  wednesday_day_hours: { text: "6h 00min" },
  wednesday_night_hours: { text: "1h 00min" },
  thursday_day_hours: { text: "5h 30min" },
  thursday_night_hours: { text: "1h 30min" },
  friday_day_hours: { text: "6h 00min" },
  friday_night_hours: { text: "2h 15min" },
  saturday_day_hours: { text: "0h 00min" },
  saturday_night_hours: { text: "5h 00min" },
  sunday_day_hours: { text: "0h 00min" },
  sunday_night_hours: { text: "0h 00min" },
  worksite_reference: { text: "Site A" },
  talent_comment: { text: "Commentaire du talent" },
  contact_comment: { text: "Commentaire du contact" },
};

// Get the form so we can add fields to it
const form = pdfDoc.getForm();

const fonts: Partial<Record<StandardFonts, PDFFont>> = {};
const standardFonts = Object.values(config)
  .map((c) => c.font)
  .filter(Boolean);
for (const standardFont of standardFonts) {
  if (standardFont) {
    fonts[standardFont] = await pdfDoc.embedFont(standardFont);
  }
}

const fields = form.getFields();
for (const field of fields) {
  const fieldName = field.getName();

  const formField = form.getTextField(fieldName);
  const fieldConfig = config[fieldName];

  const value = fieldConfig?.text ?? "";

  formField.setText(value);
  if (fieldConfig?.font) {
    formField.defaultUpdateAppearances(fonts[fieldConfig.font]!);
  }
  formField.enableReadOnly();
}

// Flatten the form so it can't be edited anymore, each field becomes a text layer (necessary to apply the font)
form.flatten();

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save();

fs.writeFileSync("./output.pdf", pdfBytes);

type TimesheetPDFConfigKeys =
  | "contact_full_name"
  | "contact_email"
  | "contact_phone_number"
  | "talent_full_name"
  | "talent_qualification"
  | "talent_email"
  | "talent_phone_number"
  | "company_name"
  | "contact_signature"
  | "talent_signature"
  | "total_day_hours"
  | "total_night_hours"
  | "monday_date"
  | "tuesday_date"
  | "wednesday_date"
  | "thursday_date"
  | "friday_date"
  | "saturday_date"
  | "sunday_date"
  | "monday_day_hours"
  | "monday_night_hours"
  | "tuesday_day_hours"
  | "tuesday_night_hours"
  | "wednesday_day_hours"
  | "wednesday_night_hours"
  | "thursday_day_hours"
  | "thursday_night_hours"
  | "friday_day_hours"
  | "friday_night_hours"
  | "saturday_day_hours"
  | "saturday_night_hours"
  | "sunday_day_hours"
  | "sunday_night_hours"
  | "month"
  | "week"
  | "start_date"
  | "end_date"
  | "worksite_reference"
  | "talent_comment"
  | "contact_comment";

type PDFGeneratorConfig<T extends string = string> = Record<
  T,
  { text: string | null; font?: StandardFonts }
>;
