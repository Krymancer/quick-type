import {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  ReactNode,
} from "react";
import { useQueryClient } from '@tanstack/react-query';

interface WebsocketContextProps {
  ready: boolean;
  send: ((data: string) => void) | undefined;
}

export const WebsocketContext = createContext<WebsocketContextProps | undefined>(undefined);

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }
  return context;
};

export const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'room_list') {
          queryClient.setQueryData(['rooms'], data.rooms);
        } else if (data.type === 'join_room_sucess') {
          queryClient.setQueryData(['current_room'], data.room);
        } else if (data.type === 'join_room_error') {
          console.error('Failed to join room', data.message);
        } else if (data.type === 'leave_room_success') {
          queryClient.setQueryData(['current_room'], null);
        } else if (data.type === 'leave_room_error') {
          console.error('Failed to leave room:', data.message);
        }

      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [queryClient]);

  const send = ws.current?.send.bind(ws.current);

  const contextValue = {
    ready: isReady,
    send,
  };

  return (
    <WebsocketContext.Provider value={contextValue}>
      {children}
    </WebsocketContext.Provider>
  );
};
