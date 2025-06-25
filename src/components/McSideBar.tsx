"use client";

import Link from 'next/link';

interface ServerDetails {
  serverName?: string;
  serverID?: string;
}

interface McSideBarProps {
  serverDetails?: ServerDetails;
  deployID: string;
  activePage: 'server' | 'options' | 'console' | 'software' | 'files' | 'worlds' | 'backup';
}

export default function McSideBar({ serverDetails, deployID, activePage }: McSideBarProps) {
  return (
    <div className="sidebar">
      <div className="server-info-card">
        <h3 className="server-name">{serverDetails?.serverName}</h3>
        <p className="server-id">Server ID: {serverDetails?.serverID}</p>
      </div>
      <nav className="menu">
        <Link 
          href={`/minecraft/${deployID}`} 
          className={`menu-item ${activePage === 'server' ? 'active' : ''}`}
        >
          Server
        </Link>
        <Link 
          href={`/minecraft/${deployID}/options`} 
          className={`menu-item ${activePage === 'options' ? 'active' : ''}`}
        >
          Options
        </Link>
        <Link 
          href={`/minecraft/${deployID}/console`} 
          className={`menu-item ${activePage === 'console' ? 'active' : ''}`}
        >
          Console
        </Link>
        <Link 
          href={`/minecraft/${deployID}/software`} 
          className={`menu-item ${activePage === 'software' ? 'active' : ''}`}
        >
          Software
        </Link>
        <Link 
          href={`/minecraft/${deployID}/files`} 
          className={`menu-item ${activePage === 'files' ? 'active' : ''}`}
        >
          Files
        </Link>
        <Link 
          href={`/minecraft/${deployID}/worlds`} 
          className={`menu-item ${activePage === 'worlds' ? 'active' : ''}`}
        >
          Worlds
        </Link>
        <div 
          className={`menu-item ${activePage === 'backup' ? 'active' : ''}`} 
          onClick={() => alert('Feature in development')}
        >
          Backup
        </div>
      </nav>
    </div>
  );
}