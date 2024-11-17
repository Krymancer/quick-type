import { RoomList } from "@/components/room-list";
import { Button } from "@/components/ui/button";
import { useWebsocket } from "@/providers/WebsocketProvider";

export const MainPage = () => {
  const { ready, send } = useWebsocket();

  const handleCreateRoom = () => {
    if (!ready || !send) return;
    send(JSON.stringify({ type: "create_room" }));
  }

  return (
    <div className="flex gap-4 flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Quick Type</h1>
      <RoomList rooms={[]} />
      <div className="flex gap-2 w-full justify-end">
        <Button onClick={handleCreateRoom}>Create a room</Button>
      </div>
    </div>
  );
}