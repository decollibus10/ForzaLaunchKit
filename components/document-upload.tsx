"use client";

import { ChangeEvent, useState } from "react";
import { UploadCloud } from "lucide-react";
import { hasSupabasePublicEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import type { DealFile } from "@/lib/types";

type DocumentUploadProps = {
  merchantProfileId: string;
  initialFiles: DealFile[];
};

export function DocumentUpload({ merchantProfileId, initialFiles }: DocumentUploadProps) {
  const [files, setFiles] = useState(initialFiles);
  const [message, setMessage] = useState("");

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!hasSupabasePublicEnv()) {
      setFiles((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          documentType: "Demo upload",
          fileName: file.name,
          status: "uploaded",
          uploadedAt: new Date().toISOString().slice(0, 10)
        }
      ]);
      setMessage("Demo mode: file added locally. Configure Supabase to store documents.");
      event.target.value = "";
      return;
    }

    const supabase = createClient();
    const storagePath = `${merchantProfileId}/${crypto.randomUUID()}-${file.name}`;
    const upload = await supabase.storage
      .from("merchant-documents")
      .upload(storagePath, file, { upsert: false });

    if (upload.error) {
      setMessage(upload.error.message);
      return;
    }

    const insert = await supabase.from("deal_files").insert({
      merchant_profile_id: merchantProfileId,
      document_type: "Merchant upload",
      file_name: file.name,
      storage_path: storagePath,
      status: "uploaded"
    });

    if (insert.error) {
      setMessage(insert.error.message);
      return;
    }

    setFiles((current) => [
      ...current,
      {
        id: storagePath,
        documentType: "Merchant upload",
        fileName: file.name,
        status: "uploaded",
        uploadedAt: new Date().toISOString().slice(0, 10)
      }
    ]);
    setMessage("Uploaded securely.");
    event.target.value = "";
  }

  return (
    <div className="document-panel">
      <div className="panel-heading">
        <div>
          <h2>Documents</h2>
          <p>Upload statements, contracts, and entity documents after login.</p>
        </div>
        <label className="icon-button">
          <UploadCloud size={18} />
          <span>Upload</span>
          <input className="visually-hidden" type="file" onChange={handleUpload} />
        </label>
      </div>
      <div className="document-list">
        {files.map((file) => (
          <div key={file.id} className="document-row">
            <div>
              <strong>{file.documentType}</strong>
              <span>{file.fileName}</span>
            </div>
            <b>{file.status.replace("_", " ")}</b>
          </div>
        ))}
      </div>
      {message ? <p className="form-status success">{message}</p> : null}
    </div>
  );
}
