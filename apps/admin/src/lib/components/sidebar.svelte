<script lang="ts">
  import { cn } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar/';
  import {
    IconDiscount2,
    IconSettings,
    IconShoppingBag,
    IconCategory,
    IconLogout,
  } from '@tabler/icons-svelte';
  import { page } from '$app/stores';
  import { eden } from 'libs';
  import { goto } from '$app/navigation';

  let className: string | null | undefined = undefined;

  export { className as class };

  $: isActive = (path: string) => $page.url.pathname.startsWith(path);

  $: getButtonVariant = (path: string) =>
    isActive(path) ? 'secondary' : 'link';

  const handleSignout = async () => {
    try {
      await eden.auth['sign-out'].get();
      goto('/signin', {
        replaceState: true,
        invalidateAll: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const modules = [
    {
      name: 'Products',
      icon: IconShoppingBag,
      href: '/products',
    },
    {
      name: 'Categories',
      icon: IconCategory,
      href: '/categories',
    },
    {
      name: 'Discounts',
      icon: IconDiscount2,
      href: '/discounts',
    },
    {
      name: 'Settings',
      icon: IconSettings,
      href: '/settings',
    },
  ];
</script>

<aside
  class={cn(
    'flex min-w-[250px] flex-col border-r bg-white px-5 py-5',
    className,
  )}
>
  <header class="space-y-4 px-2.5">
    <Avatar class="ring-1 ring-primary ring-offset-2">
      <AvatarImage
        src="https://source.boringavatars.com/beam/60/dailykicks"
      />
      <AvatarFallback>DK</AvatarFallback>
    </Avatar>

    <div>
      <p class="text-muted-foreground">Shop</p>
      <h5 class="font-semibold">Daily Kicks</h5>
    </div>
  </header>
  <div class="mt-10 flex flex-1 flex-col gap-1.5">
    {#each modules as module}
      <Button
        href={module.href}
        variant={getButtonVariant(module.href)}
        class={cn(
          'items-center justify-start px-2.5 font-normal text-muted-foreground !no-underline hover:text-foreground',
          isActive(module.href) && 'text-foreground',
        )}
      >
        <svelte:component
          this={module.icon}
          class="mb-px mr-2"
          size={18}
        />
        {module.name}
      </Button>
    {/each}

    <div class="mt-auto flex flex-col">
      <Button
        on:click={handleSignout}
        variant="secondary"
        class={cn(
          'items-center justify-start bg-rose-300/10 px-2.5 font-normal text-muted-foreground text-rose-400 !no-underline hover:bg-rose-300/20 hover:text-rose-500',
        )}
      >
        <IconLogout size={18} class="mr-2" />
        Signout
      </Button>
    </div>
  </div>
</aside>
