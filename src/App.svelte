<script>
  import JsonEditor from './lib/JsonEditor.svelte'
  import Control from './lib/Control.svelte'

  let refJsonEditor;
  let tunModeValue;
  let mixedModeValue;
</script>




<main class="container editor">
<div style="height: 100%; margin-bottom: 10px;">
<Control bind:refJsonEditor={refJsonEditor}
        bind:tunModeValue={tunModeValue}
        bind:mixedModeValue={mixedModeValue}/> 
<JsonEditor bind:refJsonEditor={refJsonEditor}     
    bind:tunModeValue={tunModeValue}
  bind:mixedModeValue={mixedModeValue} />
</div>
  </main>

<style>
  .editor {
    /* display:flex; */
    height: 100vh;
    width:100%;
    overflow: hidden;
  }
</style>
