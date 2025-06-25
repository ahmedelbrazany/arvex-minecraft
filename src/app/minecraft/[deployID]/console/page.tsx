"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useWebSocket } from '@/context/WebSocketContext';
import McSideBar from '@/components/McSideBar';

interface LogEntry {
  text: string;
  date: number;
}

interface ServerDetails {
  serverName: string;
  serverID: string;
}

export default function ConsolePage() {
  const { deployID } = useParams();
  const { socket } = useWebSocket();
  const [serverDetails, setServerDetails] = useState<ServerDetails>({ serverName: '', serverID: '' });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const commandHistory = useRef<string[]>([]);
  const commandIndex = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);

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

    fetchServerDetails();
  }, [deployID]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.isReady) {
          setIsReady(true);
          if (!data.notGotLogs) {
            socket.send(JSON.stringify({
              event: "logs",
              data: { full: true }
            }));
          }
        } else if (data.event === "logs") {
          setLogs(prevLogs => [...prevLogs, ...data.data]);
        } else if (data.data?.text) {
          setLogs(prevLogs => [...prevLogs, { text: data.data.text, date: data.data.date }]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      if (commandIndex.current > 0) {
        commandIndex.current--;
        setCommandInput(commandHistory.current[commandIndex.current] || "");
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (commandIndex.current < commandHistory.current.length - 1) {
        commandIndex.current++;
        setCommandInput(commandHistory.current[commandIndex.current]);
      } else {
        commandIndex.current = commandHistory.current.length;
        setCommandInput("");
      }
      e.preventDefault();
    }
  };

  const sendCommand = () => {
    const commandText = commandInput.trim();
    if (!commandText || !socket) return;

    commandHistory.current.push(commandText);
    commandIndex.current = commandHistory.current.length;

    socket.send(JSON.stringify({
      event: "code",
      data: commandText
    }));
    setCommandInput("");
  };

  return (
    <div className="dashboard">
      <McSideBar 
        serverDetails={serverDetails} 
        deployID={deployID as string} 
        activePage="console" 
      />
      
      <div className="content">
        <div className="log-container" style={{ height: '700px', width: '80%' }}>
          <h3>Server Log</h3>
          <div className="log-box">
            <div className="log-header">
              <span>Log Message</span>
              <span>Timestamp</span>
            </div>
            <div className="log-entries">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-message">{log.text}</span>
                  <span className="log-time">
                    {new Date(log.date).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="command-input">
            <input
              type="text"
              ref={inputRef}
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
              disabled={!isReady}
            />
            <button 
              onClick={sendCommand}
              className="isbtn"
              disabled={!isReady}
            >
              {isReady ? "Send Command" : "Connecting..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}