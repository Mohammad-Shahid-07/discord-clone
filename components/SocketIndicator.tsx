"use client";
import React from "react";
import { useSocket } from "./providers/SocketProvider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();
  return (
    <Badge variant={isConnected ? "success" : "destructive"}>
      {isConnected ? "Connected" : "Connecting..."}
    </Badge>
  );
};

export default SocketIndicator;
