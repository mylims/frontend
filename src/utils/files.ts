import { useCreateFileMutation } from './generated';

export interface TemporalFile {
  filename: string;
  hashname: string;
  mimetype: string;
  content: string | ArrayBuffer;
}

export async function uploadFile(file: TemporalFile) {
  const [createFile] = useCreateFileMutation();
  const { content, ...tempFile } = file;
  const { data, errors } = await createFile({ variables: { file: tempFile } });
  if (errors) return errors;
  const url = data?.createFile?.signedUrl;
  if (!url) return ['Empty signedUrl'];
  const formData = new FormData();
  formData.append(
    tempFile.hashname,
    typeof content === 'string' ? content : new Blob([content]),
  );
  const { json } = await fetch(url, { method: 'POST', body: formData });
  const response = await json();
  if (response.error) return [response.error];
  return tempFile;
}
