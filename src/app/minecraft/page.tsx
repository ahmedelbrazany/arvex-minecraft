'use client';

import { useEffect, useState } from "react";
export default function MinecraftPage() {
    const [deploys, setDeploys] = useState([]);
    useEffect(() => {
        const downloadData = async () => {
            const response = await fetch("https://host.storiza.store/api/v1/account/projects", {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "authorization": localStorage.getItem("accountToken") || "",
                },
                "method": "GET",
              })
              const data = await response.json();
              for(let i of data){
                console.log(i._id);
        }}
        downloadData();
        const fetchProjects = async () => {
            const response = await fetch("https://host.storiza.store/api/v1/account/projects", {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "authorization": localStorage.getItem("accountToken") || "",

                },
                
                "method": "GET",
                
              })
              const data = await response.json();
              console.log(data);
            }
            
        const fetchDeploys = async () => {
            const response = await fetch("https://host.storiza.store/api/v1/projects/k2ba5c6/deploys", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": localStorage.getItem("accountToken") || "",
                },
                "method": "GET",
            });
            const data = await response.json();
            console.log(data);
        }
        
    }, []);
    return (
        <div>
            <h1>Minecraft</h1>
        </div>
    )
}
