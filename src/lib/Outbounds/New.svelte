<script lang="ts">
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

    import {VMESS_OUTBOUND_TEMPLATE} from "./vmess.js";
    import {VLESS_OUTBOUND_TEMPLATE} from "./vless.js";
    import {SHADOWSOCKS_OUTBOUND_TEMPLATE} from "./shadowsocks.js";
    import {TROJAN_OUTBOUND_TEMPLATE} from "./trojan.js";
    import {HYSTERIA_OUTBOUND_TEMPLATE} from "./hysteria.js";
    import {SHADOWTLS_OUTBOUND_TEMPLATE} from "./shadowtls.js";   
    import {SOCKS_OUTBOUND_TEMPLATE} from "./socks.js";        
    import {readOutboundFromClipboard} from "./from_clipboard.js";


    export let refJsonEditor;

  let comboValue = "";
  let popupCombobox: PopupSettings = {
    event: 'click',
    target: 'combobox',
    placement: 'top',
    // Close the popup when the item is clicked
    closeQuery: '.listbox-item'
  };
    function newOutbound(outboundJson){
        let content = refJsonEditor.get();
        let eleNum = content.json.outbounds.length;

        let new_inbound = {... outboundJson};
        if(content.json.outbounds.some((x) => x.tag==outboundJson.tag)){
            new_inbound.tag = `${eleNum}-${ outboundJson.tag}`;
            return newOutbound(new_inbound);
        }
        let patchContent = [
            {
                op: "add",
                path: "/outbounds/-",
                value: new_inbound,
            },
        ];
        refJsonEditor.patch(patchContent);

        eleNum = content.json.outbounds.length;

        refJsonEditor.expand(
            (path) =>
                path.length < 1 ||
                (path[0] == "outbounds" && path.length < 2) ||
                (path[1] == `${eleNum}` && path.length < 3)
        );
        refJsonEditor.scrollTo(["outbounds", `${eleNum}`]);
    }
    function newVmessOutbound() {
        newOutbound(VMESS_OUTBOUND_TEMPLATE);
    }
    function newShadowsocksOutbound() {
        newOutbound(SHADOWSOCKS_OUTBOUND_TEMPLATE);
    }
    function newHysteriaOutbound() {
        newOutbound(HYSTERIA_OUTBOUND_TEMPLATE);
    }
    function newTrojanOutbound() {
        newOutbound(TROJAN_OUTBOUND_TEMPLATE);
    }
    function newShadowTLSOutbound() {
        newOutbound(SHADOWTLS_OUTBOUND_TEMPLATE);
    }
    function newVLESSOutbound() {
        newOutbound(VLESS_OUTBOUND_TEMPLATE);
    }
    function newSocksOutbound() {
        newOutbound(SOCKS_OUTBOUND_TEMPLATE);
    }
    async function newOutboundFromClipboard() {
        await readOutboundFromClipboard().then((jsonStr) =>{
            let outboundJson = JSON.parse(jsonStr);
            console.log(outboundJson);
            if(outboundJson!=null){
                if(Array.isArray(outboundJson)){
                    outboundJson.map(newOutbound);
                }
                else {
                    newOutbound(outboundJson);  
                }
            }
        });
    }
</script>

<button class="btn variant-filled w-20" use:popup={popupCombobox}>
	New
</button>


<div class="card w-36 shadow-xl py-2 top" data-popup="combobox">
  <!-- Listbox -->
  <ListBox rounded="rounded-none">
    <ListBoxItem  bind:group={comboValue} name="medium"  on:click={newOutboundFromClipboard}>
      From Clipboard
    </ListBoxItem>
        <ListBoxItem bind:group={comboValue} name="vemss" value="vemss" on:click={newVmessOutbound}>
          Vmess
        </ListBoxItem>
        <ListBoxItem bind:group={comboValue} value="Shadowsocks" on:click={newShadowsocksOutbound}>
          Shadowsocks
        </ListBoxItem>
        <ListBoxItem  bind:group={comboValue} name="medium" value="Hysteria" on:click={newHysteriaOutbound}>
          Hysteria
        </ListBoxItem>
        <ListBoxItem  bind:group={comboValue} name="medium" value="Trojan" on:click={newTrojanOutbound}>
          Trojan
        </ListBoxItem>
        <ListBoxItem  bind:group={comboValue} name="medium" value="ShadowTLS" on:click={newShadowTLSOutbound}>
          ShadowTLS
        </ListBoxItem>
        <ListBoxItem  bind:group={comboValue} name="medium" value="VLESS" on:click={newVLESSOutbound}>
          VLESS
        </ListBoxItem>
        <ListBoxItem  bind:group={comboValue} name="medium" value="Socks" on:click={newSocksOutbound}>
          Socks
        </ListBoxItem>
  </ListBox>
  <!-- Arrow -->
  <div class="arrow bg-surface-100-800-token" />
</div>

<style>
  .top {
    z-index: 1;
 }
</style>
