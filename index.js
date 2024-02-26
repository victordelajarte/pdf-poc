import { PDFDocument, StandardFonts } from "pdf-lib";
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

const specialFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

const config = {
  contact_full_name: { text: "Chuck Norris" },
  contact_email: { text: "contact@email.com" },
  contact_phone_number: { text: "+33601020304" },
  talent_full_name: { text: "Arya Stark" },
  talent_qualification: { text: "Technicien spécialisé en rien" },
  talent_email: { text: "arya.stark@winterfell.com" },
  talent_phone_number: { text: "+33610203040" },
  company_name: { text: "Company name - Agency name" },
  contact_signature: { font: specialFont, text: "Chuck Norris" },
  talent_signature: { font: specialFont, text: "Arya Stark" },
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
  friday_night_hours: { text: "2h 15min" }
}

// Get the form so we can add fields to it
const form = pdfDoc.getForm();

const fields = form.getFields();
for (const field of fields) {
  const fieldName = field.getName();
  console.log(fieldName);

  const formField = form.getTextField(fieldName);
  const fieldConfig = config[fieldName];

  const value = fieldConfig?.text ?? "";

  formField.setText(value);
  if (fieldConfig?.font) {
    formField.defaultUpdateAppearances(fieldConfig.font);
  }
  formField.enableReadOnly();
}

// Flatten the form so it can't be edited anymore, each field becomes a text layer (necessary to apply the font)
form.flatten();

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save();

fs.writeFileSync("./output.pdf", pdfBytes);
