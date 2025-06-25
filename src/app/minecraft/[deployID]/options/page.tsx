"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWebSocket } from '@/context/WebSocketContext';
import McSideBar from '@/components/McSideBar';

interface ServerDetails {
  serverName: string;
  serverID: string;
}

interface Property {
  key: string;
  value: string | boolean | number;
  type: 'text' | 'number' | 'boolean';
  note?: string;
}

const blackListKeys = [
  "generator-settings", "op-permission-level", "resource-pack-hash",
  "enable-query", "level-name", "max-world-size", "level-seed",
  "network-compression-threshold", "max-build-height", "resource-pack",
  "view-distance", "generate-structures", "motd", "level-type"
];

const notes = [
  {
    key: "difficulty",
    text: "0 = Peaceful / 1 = Easy / 2 = Normal / 3 = Hard"
  },
  {
    key: "gamemode",
    text: "0 = Survival / 1 = Creative / 2 = Adventure / 3 = Spectator"
  }
];

export default function OptionsPage() {
  const { deployID } = useParams();
  const { socket, isConnected } = useWebSocket();
  const [serverDetails, setServerDetails] = useState<ServerDetails>({ serverName: '', serverID: '' });
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isConnected || !socket) return;

    const fetchServerDetails = async () => {
      try {
        const response = await fetch(`https://host.storiza.store/api/v1/deploys/${deployID}?only_data=1`, {
          headers: {
            'Authorization': `${localStorage.getItem("accountToken")}`,
            'Content-Type': 'application/json',
          },
        });        const data = await response.json();
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
          socket.send(JSON.stringify({ event: 'properties', data: {} }));
        }
        if (data.event === 'properties') {
          const parsedProperties = data.data
            .map((property: string) => {
              const [key, value] = property.split('=');
              if (blackListKeys.includes(key)) return null;

              const trimmedValue = value.trim();
              let type: 'text' | 'number' | 'boolean' = 'text';
              
              if (Number(trimmedValue) || trimmedValue === '0') {
                type = 'number';
              } else if (trimmedValue === 'true' || trimmedValue === 'false') {
                type = 'boolean';
              }

              const note = notes.find(n => n.key === key);

              return {
                key,
                value: type === 'boolean' ? trimmedValue === 'true' : trimmedValue,
                type,
                note: note?.text
              };
            })
            .filter(Boolean);

          setProperties(parsedProperties);
          setIsLoading(false);
          if (showSuccess) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

  }, [isConnected, socket, deployID, showSuccess]);

  const handleSave = () => {
    if (!socket) return;

    const propertiesData = properties.reduce((acc, property) => {
      acc[property.key] = property.value;
      return acc;
    }, {} as Record<string, string | boolean | number>);

    socket.send(JSON.stringify({
      event: 'edit_properties',
      data: propertiesData
    }));
  };

  const handlePropertyChange = (index: number, value: string | boolean | number) => {
    const newProperties = [...properties];
    newProperties[index] = {
      ...newProperties[index],
      value
    };
    setProperties(newProperties);
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
        activePage="options" 
      />
      
      <div className="content">
        <div className="container">
          <div className="header">
            <div className="header-text">server.properties</div>
            <button 
              className="button isbtn" 
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          
          {showSuccess && (
            <div className="success-message">
              Settings saved successfully!
            </div>
          )}

          <div className="settings-container">
            {properties.map((property, index) => (
              <div key={property.key} className="setting">
                <div className="setting-label">
                  {property.key.split('-').join(' ')}
                </div>
                {property.type === 'boolean' ? (
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={property.value as boolean}
                      onChange={(e) => handlePropertyChange(index, e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                ) : (
                  <>
                    <input
                      type={property.type}
                      className="setting-value"
                      value={property.value as string}
                      onChange={(e) => handlePropertyChange(index, e.target.value)}
                    />
                    {property.note && (
                      <p className="note-text">{property.note}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}