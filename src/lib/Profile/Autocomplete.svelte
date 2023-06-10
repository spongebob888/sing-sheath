<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { onMount } from 'svelte';
	import { emit, listen } from '@tauri-apps/api/event';

	export let keyword: string;
	export let selectedProfile: string;

	export let profileList: Array<string>;

	let filteredList: Array<string> = [];

	$: filteredList = searchProfile(keyword, profileList);

	function searchProfile(keyword: string, profileList: Array<string>) {
		if (keyword != '')
			return profileList.filter((x) => x.toLowerCase().startsWith(keyword.toLowerCase()));
		else return profileList;
	}

	async function onChangeProfile(e) {
		await invoke('change_profile', {
			name: e.target.value
		})
			.then((message) => message)
			.catch((error) => alert(error));
		selectedProfile = e.target.value;
		emit('changeProfile', {});
	}

	function createAndChangeProfile(name: string) {}
</script>

<div id="popupComp" data-popup="popupAutocomplete" class="card top space-y2">
	{#each filteredList as profile, i}
		<label class="flex items-center space-x-2">
			<input
				bind:group={selectedProfile}
				on:change={onChangeProfile}
				class="radio"
				type="radio"
				name="radio-direct"
				value={profile}
			/>
			<p>{profile}</p>
		</label>
	{/each}
	{#if keyword != '' && !(filteredList.length > 0 && filteredList[0].toLowerCase() == keyword.toLowerCase())}
		<label class="flex items-center space-x-2">
			<input
				bind:group={selectedProfile}
				on:change={onChangeProfile}
				class="radio"
				type="radio"
				name="radio-direct"
				value={keyword}
			/>
			<p>Create {keyword}</p>
		</label>
	{/if}
</div>

<style>
	.top {
		z-index: 1;
	}
</style>
