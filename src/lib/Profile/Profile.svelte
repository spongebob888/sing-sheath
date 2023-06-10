<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import Autocomplete from './Autocomplete.svelte';
	import { invoke } from '@tauri-apps/api/tauri';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { listen } from '@tauri-apps/api/event';

	let selectedProfile = '';
	let profileList: Array<string> = [];

	onMount(async () => {
		selectedProfile = await getSelectedProfile();
	});

	const unlisten = listen<string>('changeProfile',async (event) => {
		selectedProfile = await getSelectedProfile();
	});

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom',
		closeQuery: 'label',
		state: async (e: Record<string, boolean>) => {
			if (e.state) {
				profileList = await getProfileList();
			}
			else {
				inputKeyword = '';
			}
		}
	};
	let inputKeyword = '';

	async function getSelectedProfile() {
		let profile = '';
		await invoke('get_selected_profile')
			.then((message: string) => {
				profile = message;
				console.log(`get selected profile: ${profile}`)
			})
			.catch((error) => alert(error));
		return profile;
	}

	async function getProfileList() {
		let list: Array<string> = [];
		await invoke('get_profile_list')
			.then((message: Array<string>) => {
				list = message;
				console.log(`get profile list: ${list}`)
			})
			.catch((error) => alert(error));
		return list;
	}
</script>

<div>
	<input
		class="input"
		type="input"
		name="demo"
		bind:value={inputKeyword}
		use:popup={popupSettings}
		placeholder={selectedProfile}
	/>

	<div>
		<Autocomplete bind:keyword={inputKeyword} bind:selectedProfile {profileList} />
	</div>
</div>
