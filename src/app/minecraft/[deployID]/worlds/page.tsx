'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useWebSocket } from '@/context/WebSocketContext';
import McSideBar from '@/components/McSideBar';
import Image from 'next/image';
import styles from './worlds.module.css';

interface FileData {
  isDir: boolean;
  content?: string;
}

interface WorldFile {
  [key: string]: FileData;
}

interface ServerDetails {
  serverName: string;
  serverID: string;
}

export default function WorldsPage() {
  const { deployID } = useParams();
  const { socket, sendMessage } = useWebSocket();
  const [serverDetails, setServerDetails] = useState<ServerDetails>({
    serverName: 'Server Name',
    serverID: 'Server ID: 123456'
  });
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [files, setFiles] = useState<WorldFile>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);


  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (!data) return;

        if (data.isReady) {
          sendMessage(JSON.stringify({ event: 'files', data: {} }));
        }
        if (data.event === 'files') {
          const filteredFiles = filterFiles(data.data);
          setFiles(filteredFiles);
        }
        if (data.event === 'file') {
          openFileModal(data.data, data.fileID, data.name);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket, sendMessage]);

  const filterFiles = (files: WorldFile): WorldFile => {
    const ignoredFiles = [
      'banned-ips.json', 'banned-players.json', 'BuildTools.log.txt',
      'eula.txt', 'ops.json', 'permissions.yml', 'usercache.json',
      'whitelist.json', 'logs', 'work', 'plugins'
    ];
    
    const filteredFiles = { ...files };
    for (const key of ignoredFiles) {
      delete filteredFiles[key];
    }
    
    for (const key of Object.keys(filteredFiles)) {
      if (key.endsWith('.mca')) {
        delete filteredFiles[key];
      }
    }
    
    return filteredFiles;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setShowUploadProgress(true);
    setUploadProgress(0);

    try {
      const response = await fetch(`https://host.storiza.store/api/upload?path=${currentPath.join('/') || '/'}`, {
        headers: {
          'Authorization': `${localStorage.getItem("accountToken")}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Upload successful!');
        sendMessage(JSON.stringify({ event: 'getFiles', data: currentPath.join('/') }));
      } else {
        alert('Upload failed!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed!');
    } finally {
      setShowUploadProgress(false);
    }
  };

  const getFiles = (dirName: string) => {
    setCurrentPath([...currentPath, dirName]);
    sendMessage(JSON.stringify({
      event: 'getFiles',
      data: [...currentPath, dirName].join('/')
    }));
  };

  const backFile = () => {
    if (currentPath.length > 0) {
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);
      sendMessage(JSON.stringify({
        event: 'getFiles',
        data: newPath.join('/') || '/'
      }));
    }
  };

  const deleteFile = async (fileId: string | null, name: string | null) => {
    const confirmDelete = window.confirm('⚠️ Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    sendMessage(JSON.stringify({
      event: 'deleteFile',
      data: fileId || name
    }));

    alert('File deleted successfully!');

    if (name) {
      backFile();
    }
  };

  const viewFile = (name: string, fileId: string) => {
    if (name.endsWith('.zip') || name.endsWith('.jar')) {
      return openFileModal('NOT ABLE TO OPEN FILE', fileId, name);
    }
    sendMessage(JSON.stringify({
      event: 'getFile',
      data: fileId
    }));
  };

  const openFileModal = (content: string, fileId: string, name: string) => {
    // Implement file modal logic here
    console.log('Opening file modal:', { content, fileId, name });
  };

  return (
    <div className={styles.dashboard}>
      <McSideBar 
        serverDetails={serverDetails} 
        deployID={deployID as string} 
        activePage="worlds" 
      />
      
      <div className={styles.content}>
        {Object.entries(files).map(([key, value]) => (
          <div key={key} className={styles.serverInfo} style={{ height: '30%' }} id={value.content || key}>
            <center>
              <Image 
                src={`/assets/${value.isDir ? 'world.png' : 'files.png'}`} 
                alt={key} 
                width={50} 
                height={50} 
              />
              <p><strong>{key}</strong></p>
            </center>
            <button 
              className={styles.button}
              onClick={() => value.isDir ? getFiles(key) : viewFile(key, value.content || '')}
            >
              {value.isDir ? 'Open Folder' : 'View File'}
            </button>
          </div>
        ))}

        <div className={styles.uploadContainer}>
          <label className={styles.uploadLabel}>
            📂 Upload Files / Folders
            <input 
              type="file" 
              multiple 
              className={styles.uploadInput}
              onChange={handleFileUpload}
            />
          </label>
          {showUploadProgress && (
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {currentPath.length > 0 && (
          <>
            <button 
              className={styles.button} 
              style={{ width: '100%', marginTop: '10px' }} 
              onClick={backFile}
            >
              ⬅ Back
            </button>
            <button 
              className={styles.button} 
              style={{ width: '100%' }} 
              onClick={() => deleteFile(null, currentPath[currentPath.length - 1])}
            >
              Remove Folder
            </button>
          </>
        )}
      </div>
    </div>
  );
}