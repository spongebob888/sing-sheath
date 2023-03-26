<script>
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { invoke } from '@tauri-apps/api/tauri';

	const MIXED_TEMPLATE = {
		type: 'mixed',
		tag: 'mixed-in',
		listen: '127.0.0.1',
		listen_port: 1088,
		set_system_proxy: true
	};

	export let mixedValue = true;

	export let refJsonEditor;

	async function newMixedInbound() {
		let content = refJsonEditor.get();
		let mixedIndex = content.json.inbounds.findIndex((out) => out.type == 'mixed');
		if (mixedIndex >= 0) {
			return true;
		}
		let mixedInbound;
		await invoke('get_default_config')
			.then((configStr) => {
				let configJson = JSON.parse(configStr);
				mixedInbound = configJson.inbounds.find((ele) => ele.type == 'mixed');
				if (mixedInbound == undefined) {
					mixedInbound = MIXED_TEMPLATE;
				}
			})
			.catch(() => (mixedInbound = MIXED_TEMPLATE));
		let patchContent = [
			{
				op: 'add',
				path: '/inbounds/-',
				value: mixedInbound
			}
		];
		refJsonEditor.patch(patchContent);

		let eleNum = content.json.inbounds.length;

		refJsonEditor.expand(
			(path) =>
				path.length < 1 ||
				(path[0] == 'inbounds' && path.length < 2) ||
				(path[1] == `${eleNum}` && path.length < 3)
		);
		refJsonEditor.scrollTo(['inbounds', `${eleNum}`]);
		return true;
	}

	function delMixedInbound() {
		let content = refJsonEditor.get();
		let mixedIndex = content.json.inbounds.findIndex((out) => out.type == 'mixed');
		if (mixedIndex < 0) {
			return false;
		}
		refJsonEditor.expand(
			(path) =>
				path.length < 1 ||
				(path[0] == 'inbounds' && path.length < 2) ||
				(path[1] == `${mixedIndex}` && path.length < 3)
		);
		refJsonEditor.scrollTo(['inbounds', `${mixedIndex}`]);
		let patchContent = [
			{
				op: 'remove',
				path: `/inbounds/${mixedIndex}`
			}
		];
		refJsonEditor.patch(patchContent);

		refJsonEditor.expand((path) => path.length < 1 || (path[0] == 'inbounds' && path.length < 2));
		return false;
	}

	async function handleChangeMixed() {
		if (mixedValue) {
			newMixedInbound();
		} else {
			delMixedInbound();
			await invoke('reset_proxy');
		}
	}
</script>

<SlideToggle
	on:change={handleChangeMixed}
	bind:checked={mixedValue}
	name="mixed-toggle"
	active="variant-filled-primary"
>
	Mixed Mode
</SlideToggle>
