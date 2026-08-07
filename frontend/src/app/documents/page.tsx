"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

import { documentService } from "@/services/document.service";

interface DocumentRecord {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  createdAt?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const response = await documentService.list();

      const items =
        (response?.data as Record<string, unknown>)?.documents ??
        response?.data ??
        [];

      setDocuments(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDocuments();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;

    if (!window.confirm("Delete this document?")) return;

    try {
      await documentService.remove(id);
      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Delete failed"
      );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Documents
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Church documents
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage important ministry files and records.
          </p>
        </div>


        <Card>

          {error && (
            <p className="mb-4 text-sm text-red-400">
              {error}
            </p>
          )}

          {loading ? (
            <Loader label="Loading documents" />
          ) : documents.length === 0 ? (

            <EmptyState
              title="No documents found"
              description="Uploaded documents will appear here."
            />

          ) : (

            <div className="space-y-3">

              {documents.map((document) => (

                <div
                  key={document._id}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] p-4"
                >

                  <div className="flex items-center gap-3">

                    <FileText size={22} />

                    <div>
                      <p className="font-medium">
                        {document.title || "Untitled document"}
                      </p>

                      <p className="text-sm text-[var(--muted)]">
                        {document.category || "General"}
                      </p>
                    </div>

                  </div>


                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(document._id)}
                  >
                    <Trash2 size={16} />
                  </Button>

                </div>

              ))}

            </div>

          )}

        </Card>

      </div>
    </AppLayout>
  );
}