"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWebSocket } from '@/context/WebSocketContext';
import { useAlert } from '@/context/AlertContext';
import McSideBar from '@/components/McSideBar';
import Image from 'next/image';
import styles from './software.module.css';

interface ServerDetails {
  serverName: string;
  serverID: string;
}

interface Software {
  mcVersion?: string[];
  includes?: string[];
}

interface LogEntry {
  text: string;
  date: number;
}

export default function SoftwarePage() {
  const { deployID } = useParams();
  const { socket } = useWebSocket();
  const { showAlert } = useAlert();
  const [serverDetails, setServerDetails] = useState<ServerDetails>({ serverName: '', serverID: '' });
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [softwaresForge, setSoftwaresForge] = useState<Software[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<{ name: string; version: string } | null>(null);

  useEffect(() => {
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

    const fetchSoftwares = async () => {
      try {
        const [softwaresRes, softwaresForgeRes] = await Promise.all([
          fetch(`https://host.storiza.store/api/v1/minecraftpanel/${deployID}/softwares`, {
            headers: {
              'Authorization': `${localStorage.getItem("accountToken")}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`https://host.storiza.store/api/v1/minecraftpanel/${deployID}/softwares?forge=true`, {
            headers: {
              'Authorization': `${localStorage.getItem("accountToken")}`,
              'Content-Type': 'application/json',
            },
          })
        ]);

        const softwaresData = await softwaresRes.json();
        const softwaresForgeData = await softwaresForgeRes.json();

        setSoftwares(softwaresData);
        setSoftwaresForge(softwaresForgeData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching softwares:', error);
      }
    };

    fetchServerDetails();
    fetchSoftwares();
  }, [deployID]);

  const addLog = (message: string, date: number) => {
    setLogs(prevLogs => [...prevLogs, { text: message, date }]);
  };

  const handleInstall = async (name: string) => {
    showAlert({
      message: "Do you want to reinstall system or see logs?",
      type: "primary"
    });

    showAlert({
      message: "Please wait while the installation is being processed...",
      type: "primary",
      duration: 10000
    });

    try {
      const response = await fetch(`https://host.storiza.store/api/v1/minecraftpanel/${deployID}/install`, {
        method: 'POST',
        headers: {
          'Authorization': `${localStorage.getItem("accountToken")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          software: name,
          v: selectedSoftware?.version,
          justTrack: false
        })
      });

      const data = await response.json();
      if (typeof data !== 'object') return;

      showAlert({
        message: "Installation started successfully",
        type: "success",
        duration: 2000
      });

      setIsInstalling(true);
      setLogs([]);

      if (socket) {
        socket.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data.isReady) {
              addLog("Installation started", Date.now());
              socket.send(JSON.stringify({
                event: "logs",
                data: { cut: 500 }
              }));
            } else if (data.event === "logs") {
              data.data.forEach((log: LogEntry) => {
                addLog(log.text, log.date);
              });
            } else if (data.event === "log" || data.data?.text) {
              addLog(data.data.text, data.data.date);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      }
    } catch (error) {
      console.error('Error installing software:', error);
      showAlert({
        message: "Failed to start installation",
        type: "danger"
      });
    }
  };

  const handleVersionSelect = (name: string, version: string) => {
    setSelectedSoftware({ name, version });
    handleInstall(name);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (isInstalling) {
    return (
      <div className={styles.dashboard}>
        <McSideBar 
          serverDetails={serverDetails} 
          deployID={deployID as string} 
          activePage="software" 
        />
        
        <div className={styles.content}>
          <div className={styles.logContainer}>
            <h3>Installation Log</h3>
            <div className={styles.logBox}>
              <div className={styles.logHeader}>
                <span>Log Message</span>
                <span>Timestamp</span>
              </div>
              <div className={styles.logEntries}>
                {logs.map((log, index) => (
                  <div key={index} className={styles.logEntry}>
                    <span className={styles.logMessage}>{log.text}</span>
                    <span className={styles.logTime}>
                      {new Date(log.date).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <McSideBar 
        serverDetails={serverDetails} 
        deployID={deployID as string} 
        activePage="software" 
      />
      
      <div className={styles.content}>
        <div className={styles.softwareGrid}>
          <div className={styles.serverInfo}>
            <Image
              src="/assets/cubs.png"
              alt="Vanilla"
              width={64}
              height={64}
            />
            <p><strong>Vanilla</strong></p>
            <button
              className={styles.button}
              onClick={() => setSelectedSoftware({ name: 'vanilla', version: '' })}
            >
              Install
            </button>
          </div>

          <div className={styles.serverInfo}>
            <Image
              src="/assets/package.png"
              alt="Spigot"
              width={64}
              height={64}
            />
            <p><strong>Spigot</strong></p>
            <button
              className={styles.button}
              onClick={() => setSelectedSoftware({ name: 'spigot', version: '' })}
            >
              Install
            </button>
          </div>

          <div className={styles.serverInfo}>
            <Image
              src="/assets/forge.png"
              alt="Forge"
              width={64}
              height={64}
            />
            <p><strong>Forge</strong></p>
            <button
              className={styles.button}
              onClick={() => setSelectedSoftware({ name: 'forge', version: '' })}
            >
              Install
            </button>
          </div>
        </div>

        {selectedSoftware && (
          <div className={styles.versionSelector}>
            <h3>Select Version</h3>
            <div className={styles.versionGrid}>
              {(selectedSoftware.name === 'forge' ? softwaresForge : softwares)
                .map(software => software.mcVersion || software.includes || [])
                .flat()
                .map((version, index) => (
                  <div key={index} className={styles.versionItem}>
                    <button
                      className={styles.versionButton}
                      onClick={() => handleVersionSelect(selectedSoftware.name, version)}
                    >
                      {version}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}