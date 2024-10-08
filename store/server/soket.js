import {
  HubConnectionBuilder,
  LogLevel,
  JsonHubProtocol,
} from "@microsoft/signalr";
import { getLocalStorageItem } from "@/store/hooks/localStorage";

let connection = null;

export async function createSignalRConnection() {
  const token = getLocalStorageItem("token");
  const user_data = getLocalStorageItem("user_data");
  if (!user_data) {
    return;
  }
  if (connection) {
    connection.onclose(() => {});
  }

  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.hubConnection}BidHub?userId=${user_data.id}`, {
      accessTokenFactory: () => token,
    })
    .withHubProtocol(new JsonHubProtocol())
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    return connection;
  } catch (error) {
    throw error;
  }
}

export async function createConnectionChat() {
  if (connection) {
    connection.onclose(() => {});
  }

  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.hubConnection}ChatHub`)
    .withHubProtocol(new JsonHubProtocol())
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();
  await connection.start();

  try {
    return connection;
  } catch (error) {
    throw error;
  }
}

export function getConnection() {
  return connection;
}
