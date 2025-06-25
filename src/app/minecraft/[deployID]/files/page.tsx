"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWebSocket } from '@/context/WebSocketContext';
import McSideBar from '@/components/McSideBar';
import Image from 'next/image';

interface ServerDetails {
  serverName: string;
  serverID: string;
}

interface FileData {
  [key: string]: {
    isDir: boolean;
    content?: string;
  };
}

export default function FilesPage() {
  const { deployID } = useParams();
  const { socket, isConnected } = useWebSocket();
  const [serverDetails, setServerDetails] = useState<ServerDetails>({ serverName: '', serverID: '' });
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [files, setFiles] = useState<FileData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fileModal, setFileModal] = useState<{
    isOpen: boolean;
    content: string;
    fileId: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!isConnected || !socket) return;

    const fetchServerDetails = async () => {
      try {
        const response = await fetch(`https://host.storiza.store/api/v1/deploys/${deployID}?only_data=1`, {
          headers: {
            'Authorization': `${localStorage.getItem("accountToken")}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setServerDetails({
          serverName: data.name,
          serverID: data._id
        });
      } catch (error) {
        console.error('Error fetching server details:', error);
      }
    };

    fetchServerDetails();

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if(data.isReady){
          socket.send(JSON.stringify({ event: 'files', data: {} }));
        }
        if (data.event === 'files') {
          const filteredFiles = filterFiles(data.data);
          setFiles(filteredFiles);
          setIsLoading(false);
        } else if (data.event === 'file') {
          setFileModal({
            isOpen: true,
            content: data.data,
            fileId: data.fileID,
            name: data.name
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

  }, [isConnected, socket, deployID]);

  const filterFiles = (files: FileData) => {
    const ignoredFiles = [
      'BuildTools.log.txt',
      'eula.txt',
      'work'
    ];
    
    const filtered = { ...files };
    for (const key of ignoredFiles) delete filtered[key];
    for (const key of Object.keys(filtered)) {
      if (key.endsWith('.mca')) delete filtered[key];
    }
    return filtered;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch(`https://host.storiza.store/api/v1/minecraftpanel/${deployID}/upload?path=${currentPath.join('/') || '/'}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        socket?.send(JSON.stringify({ event: 'getFiles', data: currentPath.join('/') }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const navigateToFolder = (folderName: string) => {
    const newPath = [...currentPath, folderName];
    setCurrentPath(newPath);
    socket?.send(JSON.stringify({
      event: 'getFiles',
      data: newPath.join('/')
    }));
  };

  const viewFile = (name: string, fileId: string) => {
    if (name.endsWith('.zip') || name.endsWith('.jar')) {
      setFileModal({
        isOpen: true,
        content: 'NOT ABLE TO OPEN FILE',
        fileId,
        name
      });
      return;
    }
    socket?.send(JSON.stringify({
      event: 'getFile',
      data: fileId
    }));
  };

  const saveFile = (fileId: string, content: string) => {
    socket?.send(JSON.stringify({
      event: 'saveFile',
      data: { fileId, content }
    }));
    setFileModal(null);
  };

  const deleteFile = async (fileId: string, name: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this file?')) return;

    socket?.send(JSON.stringify({
      event: 'deleteFile',
      data: fileId || name
    }));

    if (name) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      socket?.send(JSON.stringify({
        event: 'getFiles',
        data: newPath.join('/') || '/'
      }));
    }
  };

  const goBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      socket?.send(JSON.stringify({
        event: 'getFiles',
        data: newPath.join('/') || '/'
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <McSideBar 
        serverDetails={serverDetails} 
        deployID={deployID as string} 
        activePage="files" 
      />
      
      <div className="content">
        <div className="file-list">
          {Object.entries(files).map(([name, data]) => (
            <div key={name} className="file-item">
              <div className="file-icon">
                <Image
                  src={data.isDir ? '/assets/world.png' : '/assets/files.png'}
                  alt={data.isDir ? 'Folder' : 'File'}
                  width={32}
                  height={32}
                />
              </div>
              <div className="file-name">{name}</div>
              <button
                className="file-action"
                onClick={() => data.isDir ? navigateToFolder(name) : viewFile(name, data.content || '')}
              >
                {data.isDir ? 'Open Folder' : 'View File'}
              </button>
            </div>
          ))}
        </div>

        <div className="upload-section">
          <label className="upload-label">
            📂 Upload Files / Folders
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="upload-input"
            />
          </label>
        </div>

        {currentPath.length > 0 && (
          <div className="navigation-buttons">
            <button className="back-button" onClick={goBack}>
              ⬅ Back
            </button>
            <button 
              className="delete-button"
              onClick={() => {
                if (confirm('⚠️ Are you sure you want to delete this folder?')) {
                  deleteFile('', currentPath.join('/'));
                }
              }}
            >
              Remove Folder
            </button>
          </div>
        )}
      </div>

      {fileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">File Editor</h3>
            <textarea
              className="w-full h-64 bg-gray-700 text-white p-4 rounded mb-4"
              value={fileModal.content}
              onChange={(e) => setFileModal({ ...fileModal, content: e.target.value })}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setFileModal(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => deleteFile(fileModal.fileId, fileModal.name)}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => saveFile(fileModal.fileId, fileModal.content)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}