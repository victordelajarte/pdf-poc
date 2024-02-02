import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";

const formPdfBytes = fs.readFileSync("./input.pdf");

const pdfDoc = await PDFDocument.load(formPdfBytes);

const signatureFont = await pdfDoc.embedFont(
  StandardFonts.TimesRomanBoldItalic
);

const config = {
  company_name: { text: "My Company" },
  contact_email: { text: "victor@asap.work" },
  contact_signature: {
    font: signatureFont,
    text: "Victor de Lajarte",
  },
  start_date: { text: new Date().toLocaleDateString() },
};

// Get the form so we can add fields to it
const form = pdfDoc.getForm();

const fields = form.getFields();
for (const field of fields) {
  const fieldName = field.getName();
  console.log(fieldName);

  const formField = form.getTextField(fieldName);
  const fieldConfig = config[fieldName];

  const value = fieldConfig?.text ?? "VALEUR NON DEFINIE";

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
