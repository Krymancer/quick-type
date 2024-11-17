import {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  ReactNode,
} from "react";

interface WebsocketContextProps {
  ready: boolean;
  messages: any[];
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
  const [messages, setMessages] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);

    socket.onmessage = (event) => {
      try {
        // Parse the incoming message if it's JSON
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]); // Append the new message
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const send = ws.current?.send.bind(ws.current);

  const contextValue = {
    ready: isReady,
    messages,
    send,
  };

  return (
    <WebsocketContext.Provider value={contextValue}>
      {children}
    </WebsocketContext.Provider>
  );
};
