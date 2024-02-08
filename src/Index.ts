import { config } from "dotenv";
import { JustClient } from "./classes/JustClient";

config();
const client = new JustClient();

client.start();
