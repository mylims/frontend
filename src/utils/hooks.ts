import { useState, useEffect, useReducer } from 'react';
import { useCreateFileMutation } from './generated';

export interface TemporalFile {
  filename: string;
  hashname: string;
  mimetype: string;
  content: string | ArrayBuffer;
}

type ResponseFile = Omit<TemporalFile, 'content'>;

export interface StateFile {
  data: ResponseFile | null;
  error: any[] | null;
  loading: boolean;
}

function uploadReducer(
  state: StateFile,
  action: { type: string; payload: any },
) {
  switch (action.type) {
    case 'error':
      return { data: null, error: [action.payload], loading: false };
    case 'result':
      return { data: action.payload, error: null, loading: false };
    default:
      throw new Error();
  }
}

export function useUploadFile(file: TemporalFile) {
  const initialState = { data: null, loading: true, error: null };
  const [state, dispatch] = useReducer(uploadReducer, initialState);
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
          dispatch({ type: 'error', payload: errors });
          return null;
        }

        // Fetch the signed URL from the response
        const url = data?.createFile?.signedUrl;
        if (!url) {
          dispatch({ type: 'error', payload: 'Empty signedUrl' });
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
          dispatch({ type: 'error', payload: response.error });
        } else {
          dispatch({ type: 'result', payload: tempFile });
        }
      } catch (error) {
        dispatch({ type: 'error', payload: error });
      }
    }
    uploadFile();
  }, [file]);

  return state;
}
