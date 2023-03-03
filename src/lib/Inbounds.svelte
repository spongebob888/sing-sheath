<script>
    import Mixed from "./Inbounds/Mixed.svelte"
    import TunMode from "./Inbounds/TunMode.svelte"
    import { invoke } from "@tauri-apps/api/tauri";
    import { onMount } from "svelte";
 

    export let refJsonEditor;

    export let tunModeValue;
    export let mixedModeValue

//     onMount(async () => {
//     await invoke("get_config")
//       .then((message) => {
//         let configJson = JSON.parse(message);
//         let tunIndex = configJson.inbounds.findIndex(
//         (out) => out.type == "tun"
//         );
//         if (tunIndex >= 0){
//             tunModeValue = true;
//         }
//         else{
//             tunModeValue = false
//         }

//         let mixedIndex = configJson.inbounds.findIndex(
//         (out) => out.type == "mixed"
//         );
//         if (mixedIndex >= 0){
//             mixedModeValue = true;
//         }
//         else{
//             mixedModeValue = false
//         }
//       })
//       .catch((error) => alert(error));
//   });


</script>

<div>
<Mixed refJsonEditor={refJsonEditor} mixedValue={mixedModeValue} />
</div>

<div>
<TunMode refJsonEditor={refJsonEditor} tunModeValue={tunModeValue} />
</div>
