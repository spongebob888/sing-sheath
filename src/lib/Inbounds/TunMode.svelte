<script>
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import { invoke } from "@tauri-apps/api/tauri";


    export let refJsonEditor;
    const TUN_TEMPLATE = {
        type: "tun",
        tag: "tun-in",
        inet4_address: "172.19.0.1/30",
        auto_route: true,
        strict_route: false,
        sniff: true,
        stack: "gvisor"
    };
    export let tunModeValue = true;

    export function checkTunMode() {
        tunModeValue = true;
    }

    export function uncheckTunMode() {
        tunModeValue = false;
    }

    async function newTunInbound() {
        let content = refJsonEditor.get();
        let tunIndex = content.json.inbounds.findIndex(
            (out) => out.type == "tun"
        );
        if (tunIndex >= 0) {
            return true;
        }
        let tunInbound;
        await invoke("get_default_config")
        .then((configStr) => {
            let configJson = JSON.parse(configStr);
            let tunDefault = configJson.inbounds.find((ele)=>ele.type=="tun");
            if (tunDefault == undefined){
                tunInbound = TUN_TEMPLATE;
            }
            else
            {
                tunInbound=tunDefault;
                console.log(tunDefault);
            }
        })
        .catch((error) => tunInbound=TUN_TEMPLATE);
        let patchContent = [
            {
                op: "add",
                path: "/inbounds/-",
                value: tunInbound,
            },
        ];
        refJsonEditor.patch(patchContent);

        let eleNum = content.json.inbounds.length;

        refJsonEditor.expand(
            (path) =>
                path.length < 1 ||
                (path[0] == "inbounds" && path.length < 2) ||
                (path[1] == `${eleNum}` && path.length < 3)
        );
        refJsonEditor.scrollTo(["inbounds", `${eleNum}`]);
        return true;
    }

    function delTunInbound() {
        let content = refJsonEditor.get();
        let tunIndex = content.json.inbounds.findIndex(
            (out) => out.type == "tun"
        );
        if (tunIndex < 0) {
            return false;
        }
        refJsonEditor.expand(
            (path) =>
                path.length < 1 ||
                (path[0] == "inbounds" && path.length < 2) ||
                (path[1] == `${tunIndex}` && path.length < 3)
        );
        refJsonEditor.scrollTo(["inbounds", `${tunIndex}`]);
        let patchContent = [
            {
                op: "remove",
                path: `/inbounds/${tunIndex}`,
            },
        ];
        refJsonEditor.patch(patchContent);

        refJsonEditor.expand(
            (path) =>
                path.length < 1 || (path[0] == "inbounds" && path.length < 2)
        );
        return false;
    }

    function handleChangeTunMode() {
        if (tunModeValue) {
            newTunInbound();
        } else {
            delTunInbound();
        }
    }
</script>

<SlideToggle on:change={handleChangeTunMode}
             bind:checked={tunModeValue}
             name="tun-toggle">
  Tun Mode
             </SlideToggle>
