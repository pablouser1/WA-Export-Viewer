import { createStore } from "solid-js/store";
import type { Message } from "whatsapp-chat-parser";

const store = createStore([] as Message[]);

export default store
