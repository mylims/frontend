import { useState, useEffect } from 'react';
import { useCreateFileMutation } from './generated';

export interface TemporalFile {
  filename: string;
  hashname: string;
  mimetype: string;
  content: string | ArrayBuffer;
}

type ResponseFile = Omit<TemporalFile, 'content'>;

export function useUploadFile(file: TemporalFile) {
  const [result, setResult] = useState<ResponseFile | null>(null);
  const [error, setError] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [createFile] = useCreateFileMutation();

  useEffect(() => {
    async function uploadFile() {
      try {
        // Upload file metadata into the backend
        const { content, ...tempFile } = file;
        const { data, errors } = await createFile({
          variables: { file: tempFile },
        });
        if (errors) {
          setError([errors]);
          setLoading(false);
          return null;
        }

        // Fetch the signed URL from the response
        const url = data?.createFile?.signedUrl;
        if (!url) {
          setError(['Empty signedUrl']);
          setLoading(false);
          return null;
        }

        // Add the file to the body
        const formData = new FormData();
        formData.append(
          tempFile.hashname,
          typeof content === 'string' ? content : new Blob([content]),
        );

        // Send the file to the filesystem microservice
        const { json } = await fetch(url, { method: 'POST', body: formData });
        const response = await json();

        if (response.error) {
          setError([response.error]);
        } else {
          setResult(tempFile);
        }
      } catch (error) {
        setLoading(false);
      }
    }
    uploadFile();
  }, [file]);

  return { data: result, loading, error };
}
