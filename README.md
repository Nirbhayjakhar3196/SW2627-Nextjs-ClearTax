# Bulk Invoice Upload

A responsive bulk invoice upload system that enables users to upload invoice data via CSV and process it asynchronously in the background.

## Features

* 📄 Upload invoices using CSV files
* ⚡ Background processing with real-time progress tracking
* 🔄 Independent row processing (failed rows don't stop the upload)
* ✅ Match / ❌ Mismatch status for every invoice
* 🚨 Row-level error messages for validation failures
* 📋 Scrollable results table for reviewing processed invoices
* 📱 Fully responsive UI optimized for mobile and desktop

## Workflow

1. Upload a CSV file or a bulk CSV folder.
2. Processing starts in the background.
3. Track progress in real time.
4. Review processed invoices in the results table.
5. Fix and re-upload only the invoices that failed.

This implementation ensures fast, reliable, and fault-tolerant bulk invoice processing while providing clear feedback for every uploaded record.

ClearTax is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Team Members:- Nirbhay and Priyanshu Dolwani 
Team Leader :- Payal Vats
