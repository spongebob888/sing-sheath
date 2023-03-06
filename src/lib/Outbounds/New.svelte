<script lang="ts">
    import {
        Button,
        Dropdown,
        DropdownItem,
        DropdownMenu,
        DropdownToggle,
        Styles,
    } from "sveltestrap";
    import {VMESS_OUTBOUND_TEMPLATE} from "./vmess.js";
    import {VLESS_OUTBOUND_TEMPLATE} from "./vless.js";
    import {SHADOWSOCKS_OUTBOUND_TEMPLATE} from "./shadowsocks.js";
    import {TROJAN_OUTBOUND_TEMPLATE} from "./trojan.js";
    import {HYSTERIA_OUTBOUND_TEMPLATE} from "./hysteria.js";
    import {SHADOWTLS_OUTBOUND_TEMPLATE} from "./shadowtls.js";   
    import {SOCKS_OUTBOUND_TEMPLATE} from "./socks.js";        
    import {readOutboundFromClipboard} from "./from_clipboard.js";


    export let refJsonEditor;
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

<Styles />

<Dropdown>
    <DropdownToggle caret>New</DropdownToggle>
    <DropdownMenu>
        <DropdownItem on:click={newOutboundFromClipboard}> From Clipboard</DropdownItem>
        <DropdownItem on:click={newVmessOutbound}> Vmess </DropdownItem>
        <DropdownItem on:click={newShadowsocksOutbound}> Shadowsocks </DropdownItem>
        <DropdownItem on:click={newHysteriaOutbound}> Hysteria </DropdownItem>
        <DropdownItem on:click={newTrojanOutbound}> Trojan </DropdownItem>
        <DropdownItem on:click={newShadowTLSOutbound}> ShadowTLS </DropdownItem>
        <DropdownItem on:click={newVLESSOutbound}> VLESS </DropdownItem>
        <DropdownItem on:click={newSocksOutbound}> Socks </DropdownItem>
    </DropdownMenu>
</Dropdown>
