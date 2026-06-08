"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import message from "@/components/common/Message";
import PdfList from "@/components/pdf/PdfList";
import { StyledPdfPage } from "@/components/pdf/PdfPage.styles";
import {
  useDeletePdfMutation,
  useGetUserPdfsQuery,
  useUploadPdfMutation,
} from "@/store/services/pdf/apiSlice";
import type { InputRef } from "@/components/common/antd/Input";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const maybeError = error as { message?: unknown; data?: { message?: unknown } };

    if (typeof maybeError.data?.message === "string") {
      return maybeError.data.message;
    }

    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return fallback;
};

const Page = () => {
  const router = useRouter();
  const fileInputRef = useRef<InputRef | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: pdfs = [],
    isLoading: listLoading,
    error,
  } = useGetUserPdfsQuery();
  const showInitialLoading = listLoading && pdfs.length === 0;
  const [uploadPdf, { isLoading: uploading }] = useUploadPdfMutation();
  const [deletePdf] = useDeletePdfMutation();

  useEffect(() => {
    if (error) {
      messageApi.error('Failed to fetch PDFs');
    }
  }, [error, messageApi]);

  const handleFile = async (f?: File) => {
    if (!f) return;
    try {
      const res = await uploadPdf(f).unwrap();
      const summary = res?.data;
      const summaryText = summary
        ? `${summary.insertedTables} tables added, ${summary.duplicateTables} duplicate tables skipped, ${summary.insertedRows} rows inserted.`
        : "PDF extracted successfully";

      messageApi.success(res?.message ? `${res.message} ${summaryText}` : summaryText);
    } catch (err: unknown) {
      messageApi.error(getErrorMessage(err, "Failed to upload PDF"));
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      messageApi.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      messageApi.error("PDF file size must not exceed 1MB");
      return;
    }
    handleFile(file);
    e.currentTarget.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.input?.click();
  };

  const handleView = (id: string) => {
    router.push(`/pdf/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await deletePdf(id).unwrap();
      messageApi.success(res?.message ?? "PDF deleted successfully");
    } catch (err: unknown) {
      messageApi.error(getErrorMessage(err, "Failed to delete PDF"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <StyledPdfPage className="mx-auto max-w-7xl px-6 py-6">
      {contextHolder}
      <section className="pdf-page-hero">
        <div className="pdf-page-hero__inner">
          <div>
            <p className="pdf-page-kicker">Document Intelligence</p>
            <h2 className="pdf-page-title">PDF Extraction</h2>
            <p className="pdf-page-copy">
              Upload a PDF to extract structured rows, browse past uploads, and open the merged table view for each file.
            </p>
          </div>

          <div className="pdf-upload-card">
            <p className="pdf-upload-card__label">Upload</p>
            <h3 className="pdf-upload-card__title">Add a new PDF</h3>
            <p className="pdf-upload-card__copy">Only PDF files up to 1MB are accepted.</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="hidden"
              style={{ display: "none" }}
            />
            <Button type="primary" loading={uploading} onClick={openFilePicker} className="w-full">
              Upload PDF
            </Button>
          </div>
        </div>
      </section>

      <section className="pdf-list-card">
        <div className="pdf-list-card__header">
          <div>
            <h3 className="pdf-list-card__title">Uploaded PDFs</h3>
            <p className="pdf-list-card__subtitle">Track processed files and open a document to see the merged table rows across uploads.</p>
          </div>
        </div>

        <PdfList
          pdfs={pdfs}
          loading={showInitialLoading}
          deletingId={deletingId}
          onView={handleView}
          onDelete={handleDelete}
        />
      </section>
    </StyledPdfPage>
  );
};

export default Page;
