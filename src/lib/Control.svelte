<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import Outbounds from "./Outbounds.svelte";
  import Inbounds from "./Inbounds.svelte";

  export let refJsonEditor;
  export let tunModeValue;
  export let mixedModeValue;

  let buttonText = "Restart";
  let count = 0;
  let expandedOutboundsDep = 0;
  let expandedInbounds = false;

  async function start() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

    await addSelectorOutbounds();
    await addDnsRule();
    let content = refJsonEditor.get();
    await invoke("run_config", {
      configStr: JSON.stringify(content.json, null, "\t"),
    })
      .then((message) => message)
      .catch((error) => alert(error));
  }
  async function addSelectorOutbounds() {
    let configJson = refJsonEditor.get().json;
    let patchContent = [];
    let outboundTags = configJson.outbounds
      .filter(
        (out) => out.tag && out.type != "selector" && out.type != "shadowtls"
      )
      .map((out) => out.tag);
    let selectorIndex = configJson.outbounds.findIndex(
      (out) => out.type == "selector"
    );
    console.log(selectorIndex);
    if (selectorIndex == -1) {
      patchContent.push({
        op: "add",
        path: "/outbounds/0",
        value: { type: "selector", tag: "selector-out" },
      });
      console.log("selector outbound not found");
      selectorIndex = 0;
    }

    patchContent.push({
      op: "replace",
      path: `/outbounds/${selectorIndex}/outbounds`,
      value: outboundTags,
    });

    refJsonEditor.patch(patchContent);
  }
  async function addDnsRule() {
    let ipv46_regex =
      /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/gm;
    let outboundServer = new Set<string>();
    let configJson = refJsonEditor.get().json;
    configJson.outbounds
      .filter((out) => out.server && !ipv46_regex.test(out.server))
      .map((out) => outboundServer.add(out.server));
    outboundServer.add("yacd.haishan.me");
    let patchContent = [
      {
        op: "replace",
        path: "/dns/rules/0",
        value: {
          domain: Array.from(outboundServer),
          server: "local",
        },
      },
    ];
    refJsonEditor.patch(patchContent);
  }
  async function expandOutbounds() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    if (expandedOutboundsDep == 0) {
      refJsonEditor.expand((path) => {
        return path.length < 1 || (path[0] == "outbounds" && path.length < 2);
      });
      expandedOutboundsDep = 1;
      expandedInbounds = false;
      refJsonEditor.scrollTo(["outbounds"]);
    } else if (expandedOutboundsDep == 1) {
      refJsonEditor.expand((path) => {
        return path.length < 1 || (path[0] == "outbounds" && path.length < 3);
      });
      expandedOutboundsDep = 2;
      expandedInbounds = false;
    } else {
      refJsonEditor.expand((path) => {
        return path.length < 1;
      });
      expandedOutboundsDep = 0;
      expandedInbounds = false;
    }
    refJsonEditor.scrollTo(["outbounds"]);
  }

  async function expandInbounds() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    if (!expandedInbounds) {
      refJsonEditor.expand((path) => {
        return path.length < 1 || (path[0] == "inbounds" && path.length < 3);
      });
      expandedInbounds = true;
      expandedOutboundsDep = 0;
    } else {
      refJsonEditor.expand((path) => {
        return path.length < 1;
      });
      expandedInbounds = false;
      expandedOutboundsDep = 0;
    }
    refJsonEditor.scrollTo(["inbounds"]);
  }
  function checkInboundSwitch(content) {
    let tunIndex = content.json.inbounds.findIndex(
        (out) => out.type == "tun"
        );
        if (tunIndex >= 0){
            tunModeValue = true;
        }
        else{
            tunModeValue = false
        }

        let mixedIndex = content.json.inbounds.findIndex(
        (out) => out.type == "mixed"
        );
        if (mixedIndex >= 0){
            mixedModeValue = true;
        }
        else{
            mixedModeValue = false
        }
  }
  async function resetConfig(){
    await invoke("get_default_config")
      .then((configStr) => {
        let configJson = JSON.parse(configStr);
        let content = refJsonEditor.get();
        let contentJson = content.json;
        contentJson.outbounds.reduce(
          (acc,val)=>{
            if(acc.every((ele)=>ele.tag != val.tag)){
              acc.push(val);
            }
            return acc;
          },
          configJson.outbounds
        )
        content.json = configJson;
        refJsonEditor.set(content);
        checkInboundSwitch(content);
        console.log(configJson);
      })
      .catch((error) => alert(error));
  }
</script>

<div style="display:flex; justify-content: center; margin: 0px 8px 8px 0px;">
  <div style="margin: 8px 8px 8px 8px;">
    <div>
      <button on:click={start}>
        Restart
      </button>
    </div>
    <div>
      <button on:click={resetConfig} style="margin: 4px 4px 4px 4px;">
        Reset
      </button>
    </div>
  </div>

  <div style="margin: 8px 8px 8px 8px;">
    <div>
      <button on:click={expandOutbounds}> outbounds </button>
    </div>
    <div style="margin: 4px 4px 4px 4px">
      <Outbounds {refJsonEditor} />
    </div>
  </div>

  <div style="margin: 8px 8px 8px 8px;">
    <button on:click={expandInbounds}> inbounds </button>
    <Inbounds {refJsonEditor} {mixedModeValue} {tunModeValue}/>
  </div>
</div>

<style>
  .button-all {
    display: flex;
    justify-content: center;
  }
</style>
