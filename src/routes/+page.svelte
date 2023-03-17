<script>
	import JsonEditor from '../lib/JsonEditor.svelte';
	import Control from '../lib/Control.svelte';

	let refJsonEditor;
	let tunModeValue;
	let mixedModeValue;
</script>

<div class="container h-full flex-column justify-center items-center">
	<div>
		<Control
			bind:refJsonEditor
			bind:tunModeValue
			bind:mixedModeValue
			clsss="flex-column items-center"
		/>
	</div>
	<div>
		<JsonEditor bind:refJsonEditor bind:tunModeValue bind:mixedModeValue />
	</div>
</div>
