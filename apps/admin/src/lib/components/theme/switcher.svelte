<script lang="ts">
  import { onMount } from 'svelte';

  import {
    getModeOsPrefers,
    modeCurrent,
    setModeCurrent,
    setModeUserPrefers,
  } from './theme';

  import { Button } from '../ui/button';
  import { cn } from '$lib/utils';
  import { IconLogout } from '@tabler/icons-svelte';

  const onToggleHandler = () => {
    $modeCurrent = !$modeCurrent;
    setModeUserPrefers($modeCurrent);
    setModeCurrent($modeCurrent);
  };

  // Lifecycle
  onMount(() => {
    // Sync lightswitch with the theme
    if (!('modeCurrent' in localStorage)) {
      setModeCurrent(getModeOsPrefers());
    }
  });
</script>

<Button
  on:click={onToggleHandler}
  variant="secondary"
  class={cn(
    'items-center justify-start bg-rose-300/10 px-2.5 font-normal text-muted-foreground text-rose-400 !no-underline hover:bg-rose-300/20 hover:text-rose-500',
  )}
>
  <IconLogout size={18} class="mr-2" />
  Signout
</Button>
