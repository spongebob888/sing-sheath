<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { AppShell } from '@skeletonlabs/skeleton';

	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<Drawer>
	<div class="h-full">
		<object
			title="clash-ui"
			type="text/html"
			data="http://localhost:33211/?host=127.0.0.1&port={$drawerStore.meta.port}&secret={$drawerStore.meta.secret}#/proxies"
			width="100%"
			height="100%"
			style="overflow:hidden;border:5px"
		/>
	</div>
</Drawer>
<AppShell>
	<!-- <svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment> -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
</AppShell>
