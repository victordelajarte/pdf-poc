import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';

const config = {
    company_name: { text: () => 'My Company' },
    contact_email: { text: () => 'victor@asap.work' },
    contact_signature: {
        isSignature: true,
        text: () => 'Victor de Lajarte',
    }
}

const formPdfBytes = fs.readFileSync('./input.pdf');

const pdfDoc = await PDFDocument.load(formPdfBytes);

const signatureFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

// Get the form so we can add fields to it
const form = pdfDoc.getForm();

const fields = form.getFields();
for (const field of fields) {
    const fieldName = field.getName();
    console.log(fieldName);

    const formField = form.getTextField(fieldName);
    const fieldConfig = config[fieldName];

    const value = fieldConfig?.text?.() ?? 'VALEUR NON DEFINIE';

    formField.setText(value);
    if (fieldConfig?.isSignature) {
        formField.defaultUpdateAppearances(signatureFont);
    }
    formField.enableReadOnly();
}

form.flatten();

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()

fs.writeFileSync('./output.pdf', pdfBytes);
