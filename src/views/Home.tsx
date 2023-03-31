import { useNavigate } from "@solidjs/router";
import { FaSolidSpinner, FaSolidUpload } from "solid-icons/fa";
import { createSignal, Show } from "solid-js";
import { parseString } from "whatsapp-chat-parser";
import store from "../store";

const Home = () => {
  const navigate = useNavigate();
  const [parsing, setParsing] = createSignal(false);
  const setMessages = store[1];

  const handleNewFile = async (input: EventTarget & HTMLInputElement) => {
    if (input.files && input.files.length === 1) {
      setParsing(true);
      const msg = await input.files[0].text();
      setMessages(parseString(msg));
      setParsing(false);
      navigate("/viewer");
    }
  };

  return (
    <section class="hero is-fullheight">
      <div class="hero-body">
        <div class="container">
          <p class="title">Whatsapp Export Viewer</p>
          <div class="field">
            <div class="control">
              <div class="file is-boxed">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    accept="text/plain"
                    onChange={(e) => handleNewFile(e.target)}
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <FaSolidUpload />
                    </span>
                    <span class="file-label">
                      <Show when={parsing()} fallback={"Choose a file"}>
                        <span class="icon-text">
                          <span class="icon">
                            <FaSolidSpinner />
                          </span>
                          <span>Loading...</span>
                        </span>
                      </Show>
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
